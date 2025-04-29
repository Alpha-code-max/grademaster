'use client'
import { useState } from 'react';
import CourseInputRow from "@/components/CourseInputRow";
import Table from "@/components/Table";
import NavBar from "@/components/NavBar";
import useCourses from '@/store/useCourses.js';

export default function CoursePage() {
    const courses = useCourses((state) => state.courses);
    
    const calculateCGPA = () => {
        if (!courses || courses.length === 0) return 0;
        
        const totalGradePoints = courses.reduce(
            (acc, course) => acc + (course.gradePoint * course.credit), 
            0
        );
        const totalCredits = courses.reduce(
            (acc, course) => acc + course.credit, 
            0
        );
        
        return totalGradePoints / totalCredits;
    };

    console.log(courses)

    const CGPA = calculateCGPA();

    return (
        <div className="bg-background">
            <div className="bg-background mb-10">
                <NavBar />
            </div>
            <div className="heading text-center my-10">
                Course Page
            </div>
            <CourseInputRow />
            <div className="body text-center my-10 text-text">
                Please remember to put in the courses in their accurate order
            </div>
            <Table />
            <div className="text-center text-text font-bold text-2xl mt-10">
                Your CGPA is: {isNaN(CGPA) ? "0.00" : CGPA.toFixed(2)}
            </div>
        </div>
    )
}