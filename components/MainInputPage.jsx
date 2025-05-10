'use client'

import CourseInputRow from "@/components/CourseInputRow"
import Table from "@/components/Table"
import NavBar from "@/components/NavBar"
import useCourses from '@/store/useCourses.js'
import Link from "next/link"
import { MdDelete, MdVisibility, MdSave } from "react-icons/md"

export default function MainInputPage() {
    const courses = useCourses((state) => state.courses)
    const clear = useCourses((state) => state.clearCourses)

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

    const handleSaveCGPAToDatabase = async () => {
        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cgpa: CGPA.toFixed(2), courses }),
            });

            if (!response.ok) {
                throw new Error('Failed to save CGPA to the database');
            }

            const data = await response.json();
            alert('CGPA saved successfully!');
        } catch (error) {
            console.error('Error saving CGPA:', error);
            alert('An error occurred while saving CGPA.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <NavBar />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-32">
                <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                    <header className="text-center space-y-3 sm:space-y-4">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                            Course Management
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                            Input your courses in sequential order for accurate CGPA calculation
                        </p>
                    </header>

                    <div className="w-full overflow-x-auto">
                        <CourseInputRow />
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <Table />
                    </div>

                    {courses.length > 0 && (
                        <section className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-gray-200 shadow-lg backdrop-blur-sm">
                            <div className="container mx-auto max-w-4xl px-4 py-3 sm:py-4">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                    <div className="flex items-baseline gap-2 sm:gap-3">
                                        <span className="text-sm sm:text-base text-gray-600">Current CGPA:</span>
                                        <span className="text-2xl sm:text-3xl font-bold text-primary">
                                            {CGPA.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex flex-row flex-wrap sm:flex-nowrap gap-2 sm:gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={() => clear()}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Clear all courses"
                                        >
                                            <MdDelete size={18} />
                                            <span className="hidden sm:inline">Clear All</span>
                                        </button>

                                        <Link
                                            href="/ViewCourses"
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                        >
                                            <MdVisibility size={18} />
                                            <span className="hidden sm:inline">View All</span>
                                        </Link>

                                        <button
                                            onClick={handleSaveCGPAToDatabase}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                                        >
                                            <MdSave size={18} />
                                            <span className="hidden sm:inline">Save CGPA</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    )
}