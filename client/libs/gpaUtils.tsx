// utils/gpaUtils.ts

export const GRADE_SCALE_5 = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
export const GRADE_SCALE_4 = { A: 4, B: 3, C: 2, D: 1, F: 0 };

interface Course {
  courseName: string;
  credit: number;
  grade: string;
  semester: string;
  level: string;
}

// ✅ Single-source GPA calculator
export const computeGPA = (courses: Course[], scale: '4' | '5'): number => {
  const gradeMap = scale === '5' ? GRADE_SCALE_5 : GRADE_SCALE_4;

  const { totalGradePoints, totalCredits } = courses.reduce(
    (acc, course) => {
      const gradePoint = gradeMap[course.grade] ?? 0;
      acc.totalGradePoints += gradePoint * course.credit;
      acc.totalCredits += course.credit;
      return acc;
    },
    { totalGradePoints: 0, totalCredits: 0 }
  );

  return totalCredits > 0 ? Number((totalGradePoints / totalCredits).toFixed(2)) : 0;
};


export const getClassification = (gpa: number, scale: string) => {
  if (scale === '5') {
    if (gpa >= 4.5) return 'Excellent! First Class';
    if (gpa >= 3.5) return 'Great! Second Class Upper';
    if (gpa >= 2.5) return 'Good! Second Class Lower';
    if (gpa >= 1.5) return 'Pass';
    return 'Needs Improvement';
  } else {
    if (gpa >= 3.5) return 'Excellent! First Class';
    if (gpa >= 3.0) return 'Great! Second Class Upper';
    if (gpa >= 2.0) return 'Good! Second Class Lower';
    if (gpa >= 1.0) return 'Pass';
    return 'Needs Improvement';
  }
};

