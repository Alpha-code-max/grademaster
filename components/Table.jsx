'use client'

import { MdDelete, MdEdit } from "react-icons/md";
import useCourses from "@/store/useCourses";


export default function Table() {
    const RemoveCourses = useCourses((state) => state.removeCourse)
    const courses = useCourses((state) => state.courses)
    return (
        <div className="overflow-x-auto rounded-xl container mx-auto shadow-md">
            <div className="heading text-center text-2xl font-bold py-4">Courses Table</div>
            <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Course</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Credit</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Grade</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Semester</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Grade Point</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Delete</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Edit</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {courses.map((course, index) => (
                        <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <td className="px-6 py-4 text-sm text-gray-900">{course.courseName}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{course.credit}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{course.grade}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{course.semester}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{course.level}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{course.gradePoint}</td>
                            <td className="px-6 py-4 text-sm text-error">
                                <button className="px-6 py-4 text-sm text-error cursor-pointer" onClick={() => RemoveCourses(course)}>
                                    <MdDelete size={20}/>
                                </button>
                            </td>
                            <td className="px-6 py-4 text-sm text-primary">
                                <button className="px-6 py-4 text-sm text-primary cursor-pointer">
                                    <MdEdit size={20}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
