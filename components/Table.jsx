'use client'

import { MdDelete, MdEdit } from "react-icons/md";
import useCourses from "@/store/useCourses";

export default function Table() {
    const removeCourse = useCourses((state) => state.removeCourse);
    const courses = useCourses((state) => state.courses);

    return (
        <div className="overflow-x-auto rounded-lg md:rounded-xl container mx-auto shadow-md">
            <div className="heading text-center text-xl md:text-2xl font-bold py-2 md:py-4">
                Courses Table
            </div>
            
            {/* Mobile View */}
            <div className="md:hidden">
                {courses.map((course) => (
                    <div key={course.id} 
                         className="bg-white p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-gray-900">{course.courseName}</h3>
                            <div className="flex gap-2">
                                <button className="text-primary" onClick={() => {}}>
                                    <MdEdit size={18}/>
                                </button>
                                <button className="text-error" onClick={() => removeCourse(course.id)}>
                                    <MdDelete size={18}/>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-600">Credit: <span className="text-gray-900">{course.credit}</span></div>
                            <div className="text-gray-600">Grade: <span className="text-gray-900">{course.grade}</span></div>
                            <div className="text-gray-600">Semester: <span className="text-gray-900">{course.semester}</span></div>
                            <div className="text-gray-600">Year: <span className="text-gray-900">{course.level}</span></div>
                            <div className="text-gray-600">Grade Point: <span className="text-gray-900">{course.gradePoint}</span></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Course</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Credit</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Grade</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Semester</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Year</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Grade Point</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-900">{course.courseName}</td>
                                <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-700">{course.credit}</td>
                                <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-700">{course.grade}</td>
                                <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-700">{course.semester}</td>
                                <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-700">{course.level}</td>
                                <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-700">{course.gradePoint}</td>
                                <td className="px-4 md:px-6 py-4 text-xs md:text-sm flex gap-2">
                                    <button className="text-primary" onClick={() => {}}>
                                        <MdEdit size={18}/>
                                    </button>
                                    <button className="text-error" onClick={() => removeCourse(course.id)}>
                                        <MdDelete size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
