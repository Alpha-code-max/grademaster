import { create } from "zustand";
import courseService, {
  // ICourse,
  ICourseDocumentLean,
} from "@/libs/courseAxios";

/** -------------------------------
 *  Types
 *  ------------------------------- */
export interface ICourse {
  courseName: string;
  credit: number;
  grade: "A" | "B" | "C" | "D" | "E" | "F";
  semester: string;
  level: "100" | "200" | "300" | "400" | "500" | "600";
}

export interface LocalCourseGroup {
  gradeScale: "4" | "5";
  courses: ICourse[];
  cgpa: number;
}

interface CourseStore {
  courses: ICourseDocumentLean[];
  selectedCourse: ICourseDocumentLean | null;
  loading: boolean;
  error: string | null;

  localCourses: LocalCourseGroup[];
  setLocalCourses: (groups: LocalCourseGroup[]) => void;
  addCourseGroup: () => void;
  updateCourseGroup: (index: number, updated: LocalCourseGroup) => void;
  removeCourseGroup: (index: number) => void;
  clearLocalCourses: () => void;
  updateCourseScale: (index: number, scale: "4" | "5") => void;
  recalcCGPA: (index: number) => void;

  // Backend CRUD
  fetchAllCourses: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
  createCourse: (groupData: LocalCourseGroup) => Promise<void>;
  updateCourse: (id: string, courseData: Partial<ICourse>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;

  setSelectedCourse: (course: ICourseDocumentLean | null) => void;
  clearError: () => void;
}

/** -------------------------------
 *  Helper: GPA Calculator
 *  ------------------------------- */
function calculateCGPA(group: LocalCourseGroup): number {
  if (!group.courses.length) return 0;

  const gradePoints =
    group.gradeScale === "5"
      ? { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 }
      : { A: 4, B: 3, C: 2, D: 1, F: 0 };

  let totalPoints = 0;
  let totalCredits = 0;

  group.courses.forEach((c) => {
    const gp = gradePoints[c.grade as keyof typeof gradePoints] ?? 0;
    totalPoints += gp * c.credit;
    totalCredits += c.credit;
  });

  return totalCredits === 0 ? 0 : parseFloat((totalPoints / totalCredits).toFixed(2));
}

/** -------------------------------
 *  Zustand Store
 *  ------------------------------- */
export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  selectedCourse: null,
  loading: false,
  error: null,

  /** -------------------------------
   *  Local Editing State
   *  ------------------------------- */
  localCourses: [],

  setLocalCourses: (groups) => set({ localCourses: groups }),

  addCourseGroup: () =>
    set((state) => ({
      localCourses: [
        ...state.localCourses,
        {
          gradeScale: "5",
          courses: [
            {
              courseName: "",
              credit: 0,
              grade: "A", // default valid value
              semester: "First",
              level: "100", // ✅ valid from dropdown
            },
          ],
          cgpa: 0,
        },
      ],
    })),

  updateCourseGroup: (index, updated) =>
    set((state) => {
      const groups = [...state.localCourses];
      groups[index] = { ...updated, cgpa: calculateCGPA(updated) };
      return { localCourses: groups };
    }),

  removeCourseGroup: (index) =>
    set((state) => ({
      localCourses: state.localCourses.filter((_, i) => i !== index),
    })),

  clearLocalCourses: () => set({ localCourses: [] }),

  updateCourseScale: (index, scale) =>
    set((state) => {
      const groups = [...state.localCourses];
      if (!groups[index]) return state;
      groups[index].gradeScale = scale;
      groups[index].cgpa = calculateCGPA(groups[index]);
      return { localCourses: groups };
    }),

  recalcCGPA: (index) =>
    set((state) => {
      const groups = [...state.localCourses];
      if (!groups[index]) return state;
      groups[index].cgpa = calculateCGPA(groups[index]);
      return { localCourses: groups };
    }),

  /** -------------------------------
   *  Backend CRUD
   *  ------------------------------- */
  fetchAllCourses: async () => {
    set({ loading: true, error: null });
    try {
      const data = await courseService.getAllCourses();
      console.log("✅ Fetched all courses:", data);
      set({ courses: Array.isArray(data) ? data : [], loading: false });
    } catch (error: unknown) {
      console.error("❌ Fetch error:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch courses",
        loading: false,
      });
    }
  },

  fetchCourseById: async (id) => {
    set({ loading: true, error: null });
    try {
      const courseDoc = await courseService.getCourseById(id);
      console.log("✅ Fetched course by ID:", courseDoc);
      set({ selectedCourse: courseDoc, loading: false });
    } catch (error: unknown) {
      console.error("❌ Fetch single course error:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch course",
        loading: false,
      });
    }
  },

  createCourse: async (groupData) => {
    set({ loading: true, error: null });
    try {
      const gpaScale: "4.0" | "5.0" = groupData.gradeScale === "4" ? "4.0" : "5.0";

      const validGrades = ["A", "B", "C", "D", "E", "F"] as const;
      const validLevels = ["100", "200", "300", "400", "500", "600"] as const;

      const validatedCourses: ICourse[] = groupData.courses.map((c) => {
        if (!validGrades.includes(c.grade as any)) {
          throw new Error(`Invalid grade: ${c.grade}`);
        }
        if (!validLevels.includes(c.level as any)) {
          throw new Error(`Invalid level: ${c.level}`);
        }

        return {
          ...c,
          grade: c.grade as ICourse["grade"],
          level: c.level as ICourse["level"],
        };
      });

      const payload = {
        gpaScale,
        courses: validatedCourses,
        cgpa: calculateCGPA(groupData),
      };

      console.log("📤 Sending payload:", payload);
      const newDoc = await courseService.createCourse(payload);
      console.log("✅ Created:", newDoc);

      set((state) => ({
        courses: [...state.courses, newDoc],
        loading: false,
      }));
    } catch (error: unknown) {
      console.error("❌ Create course error:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to create course",
        loading: false,
      });
    }
  },

  updateCourse: async (id, courseData) => {
    set({ loading: true, error: null });
    try {
      const updatedDoc = await courseService.updateCourse(id, courseData);
      console.log("✅ Updated course:", updatedDoc);
      set((state) => ({
        courses: state.courses.map((doc) => (doc._id === id ? updatedDoc : doc)),
        loading: false,
      }));
    } catch (error: unknown) {
      console.error("❌ Update course error:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to update course",
        loading: false,
      });
    }
  },

  deleteCourse: async (id) => {
    set({ loading: true, error: null });
    try {
      await courseService.deleteCourse(id);
      console.log("✅ Deleted:", id);
      set((state) => ({
        courses: state.courses.filter((doc) => doc._id !== id),
        loading: false,
      }));
    } catch (error: unknown) {
      console.error("❌ Delete course error:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to delete course",
        loading: false,
      });
    }
  },

  /** Misc helpers */
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  clearError: () => set({ error: null }),
}));
