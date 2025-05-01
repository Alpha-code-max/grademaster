'use client'

import { useState } from 'react'
import CourseInputRow from "@/components/CourseInputRow"
import Table from "@/components/Table"
import NavBar from "@/components/NavBar"
import useCourses from '@/store/useCourses.js'

export default function CoursePage() {
    const courses = useCourses((state) => state.courses)
    
    const calculateCGPA = () => {
        if (!courses || courses.length === 0) return 0
        
        const totalGradePoints = courses.reduce(
            (acc, course) => acc + (course.gradePoint * course.credit), 
            0
        )
        const totalCredits = courses.reduce(
            (acc, course) => acc + course.credit, 
            0
        )
        
        return totalGradePoints / totalCredits
    }

    const CGPA = calculateCGPA()

    return (
        <div className="container mx-auto bg-background">
            <header className="mb-10 bg-background">
                <NavBar />
            </header>

            <main>
                <h1 className="heading text-center my-10">
                    Course Page
                </h1>

                <CourseInputRow />

                <p className="body text-center my-10 text-text">
                    Please remember to put in the courses in their accurate order
                </p>

                <Table />

                    <section className="my-3 sticky z-50 top-/5 w-full bg-gray-100 container mx-auto shadow-md rounded-xl p-5">
                        <div className="text-center text-text font-bold text-2xl">
                            Your CGPA is: {CGPA.toFixed(2)}
                        </div>

                        <button className="my-3 cursor-progress w-full py-2 mt-5 text-center font-extrabold text-white rounded-lg bg-accent hover:bg-accent/80 transition-colors">
                            SAVE CGPA TO DATABASE
                        </button>
                    </section>
                
            </main>
        </div>
    )
}