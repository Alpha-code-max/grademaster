import { create } from "zustand";

const useCourses = create((set) => ({
    courses: [],
    addCourse: (course) => set((state) => ({ 
        courses: [...state.courses, course]
    })),
    removeCourse: (course) => set((state) => ({ 
        courses: state.courses.filter((c) => c !== course)
    })),
    clearCourses: () => set({ courses: [] }),
    setCourses: (courses) => set({ courses }),

}))

export default useCourses;

