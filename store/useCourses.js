import { create } from 'zustand';

const calculateGradePoint = (grade) => {
    const gradePoints = {
        'A': 5.0,
        'B': 4.0,
        'C': 3.0,
        'D': 2.0,
        'E': 1.0,
        'F': 0.0
    };
    return gradePoints[grade] || 0;
};

const useCourses = create((set) => ({
    courses: [],
    addCourse: (courseData) => {
        const courseWithGradePoint = {
            ...courseData,
            id: Date.now(),
            gradePoint: calculateGradePoint(courseData.grade)
        };

        set((state) => ({
            courses: [...state.courses, courseWithGradePoint]
        }));
    },
    removeCourse: (courseId) => {
        set((state) => ({
            courses: state.courses.filter(course => course.id !== courseId)
        }));
    },
    clearCourses: () => {
        set({ courses: [] });
    }
}));

export default useCourses;