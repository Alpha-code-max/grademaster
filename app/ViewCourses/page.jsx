'use client'

import useCourses from "@/store/useCourses"
import { MdSchool, MdGrade, MdBook, MdCalendarToday, MdScore } from "react-icons/md"
import NavBar from "@/components/NavBar"

export default function ViewCourses() {
    const courses = useCourses((state) => state.courses)

    if (!courses || courses.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <NavBar />
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <MdSchool size={64} className="text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Courses Yet</h2>
                        <p className="text-gray-500 text-center">Start adding courses to view them here</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <NavBar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Courses</h1>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course, index) => (
                        <div 
                            key={course.id || index} 
                            className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-300"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                                {course.courseName}
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MdBook className="text-primary/60" size={20} />
                                    <span>Credit: <span className="font-medium text-gray-900">{course.credit}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MdGrade className="text-primary/60" size={20} />
                                    <span>Grade: <span className="font-medium text-gray-900">{course.grade}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MdCalendarToday className="text-primary/60" size={20} />
                                    <span>Level: <span className="font-medium text-gray-900">{course.level}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MdCalendarToday className="text-primary/60" size={20} />
                                    <span>Semester: <span className="font-medium text-gray-900">{course.semester}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 pt-2 border-t">
                                    <MdScore className="text-primary/60" size={20} />
                                    <span>Grade Point: <span className="font-medium text-gray-900">{course.gradePoint}</span></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}