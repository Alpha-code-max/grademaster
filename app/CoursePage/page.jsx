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
            (acc, course) => acc + course.credit, 0
        )
        
        return totalGradePoints / totalCredits
    }

    const CGPA = calculateCGPA()

    return (
        <div className="w-full min-h-screen px-4 md:px-6 lg:px-8 bg-background">
            <header className="mb-6 md:mb-10 bg-background">
                <NavBar />
            </header>

            <main className="max-w-7xl mx-auto">
                <h1 className="heading text-center text-2xl md:text-3xl lg:text-4xl my-6 md:my-10">
                    Course Page
                </h1>

                <CourseInputRow />

                <p className="body text-center text-sm md:text-base my-6 md:my-10 text-text">
                    Please remember to put in the courses in their accurate order
                </p>

                <Table />

                <section className="my-3 sticky bottom-0 md:bottom-4 z-50 w-full max-w-3xl mx-auto bg-gray-100 shadow-md rounded-xl p-4 md:p-5">
                    <div className="text-center text-text font-bold text-xl md:text-2xl">
                        Your CGPA is: {CGPA.toFixed(2)}
                    </div>

                    <div className='flex flex-col md:flex-row gap-2 items-center justify-center'>
                        <button className='w-full md:w-1/2 py-2 px-4 mt-3 text-sm md:text-base text-center font-bold text-white rounded-lg bg-primary hover:bg-primary/80 transition-colors'>
                            CLEAR ALL COURSES
                        </button>
                        <button className="w-full md:w-1/2 py-2 px-4 mt-3 text-sm md:text-base text-center font-bold text-white rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                            SAVE CGPA TO DATABASE
                        </button>
                    </div>
                </section>
            </main>
        </div>
    )
}