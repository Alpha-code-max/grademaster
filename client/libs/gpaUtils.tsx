// libs/gpaUtils.ts

/** -------------------------------
 *  Grade Scales
 *  ------------------------------- */
export const GRADE_SCALE_5 = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 } as const;
export const GRADE_SCALE_4 = { A: 4, B: 3, C: 2, D: 1, F: 0 } as const;

export type Scale = "4" | "5";

/** -------------------------------
 *  Course & Group Types
 *  ------------------------------- */
export interface Course {
  courseName: string;
  credit: number;
  grade: string; // store model keeps it as string
  semester: string;
  level: string;
}

export interface CourseGroup {
  level?: string;
  semester?: string;
  gradeScale: Scale;
  courses: Course[];
  cgpa: number;
}

/** -------------------------------
 *  Parse a grade string to valid grade
 *  ------------------------------- */
export const parseGrade = (grade: string, scale: Scale): string => {
  const validGrades = scale === "5" ? ["A","B","C","D","E","F"] : ["A","B","C","D","F"];
  const g = grade.toUpperCase();
  return validGrades.includes(g) ? g : "F";
};

/** -------------------------------
 *  Compute GPA for a group of courses
 *  ------------------------------- */
export const computeGPA = (courses: Course[], scale: Scale): number => {
  const gradeMap = scale === "5" ? GRADE_SCALE_5 : GRADE_SCALE_4;

  const { totalGradePoints, totalCredits } = courses.reduce(
    (acc, course) => {
      const gp = gradeMap[course.grade as keyof typeof gradeMap] ?? 0;
      acc.totalGradePoints += gp * course.credit;
      acc.totalCredits += course.credit;
      return acc;
    },
    { totalGradePoints: 0, totalCredits: 0 }
  );

  return totalCredits ? Number((totalGradePoints / totalCredits).toFixed(2)) : 0;
};

/** -------------------------------
 *  Get classification string
 *  ------------------------------- */
export const getClassification = (gpa: number, scale: Scale): string => {
  if (scale === "5") {
    if (gpa >= 4.5) return "Excellent! First Class";
    if (gpa >= 3.5) return "Great! Second Class Upper";
    if (gpa >= 2.5) return "Good! Second Class Lower";
    if (gpa >= 1.5) return "Pass";
    return "Needs Improvement";
  } else {
    if (gpa >= 3.5) return "Excellent! First Class";
    if (gpa >= 3.0) return "Great! Second Class Upper";
    if (gpa >= 2.0) return "Good! Second Class Lower";
    if (gpa >= 1.0) return "Pass";
    return "Needs Improvement";
  }
};

/** -------------------------------
 *  Add a course safely to a group
 *  ------------------------------- */
export const addCourseToGroup = (
  group: CourseGroup,
  newCourseInput: {
    courseName: string;
    credit: number;
    grade: string;
    semester: string;
    level: string;
  }
): CourseGroup => {
  const typedGrade = parseGrade(newCourseInput.grade, group.gradeScale);

  const newCourse: Course = {
    ...newCourseInput,
    grade: typedGrade,
  };

  const updatedGroup: CourseGroup = {
    ...group,
    courses: [...group.courses, newCourse],
    cgpa: computeGPA([...group.courses, newCourse], group.gradeScale),
  };

  return updatedGroup;
};
