'use client';

import { MdDelete } from 'react-icons/md';

interface Course {
  courseName: string;
  credit: number;
  grade: string;
  semester: string;
  level: string;
}

interface TableProps {
  courses: Course[];
  gradeScale: '4' | '5';
  onRemove: (scale: '4' | '5', index: number) => void;
}

const Table = ({ courses, gradeScale, onRemove }: TableProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No courses added yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm text-left border-collapse">
        {/* Header */}
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
            <th className="px-4 py-3 font-semibold border-b">Course Name</th>
            <th className="px-4 py-3 font-semibold border-b text-center">Credit</th>
            <th className="px-4 py-3 font-semibold border-b text-center">Grade</th>
            <th className="px-4 py-3 font-semibold border-b text-center">Semester</th>
            <th className="px-4 py-3 font-semibold border-b text-center">Level</th>
            <th className="px-4 py-3 font-semibold border-b text-center">Action</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {courses.map((course, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 even:bg-gray-50/30 transition-colors duration-200"
            >
              <td className="px-4 py-3 border-b font-medium text-gray-800">
                {course.courseName}
              </td>
              <td className="px-4 py-3 border-b text-center text-gray-700">
                {course.credit}
              </td>
              <td className="px-4 py-3 border-b text-center font-semibold text-blue-600">
                {course.grade}
              </td>
              <td className="px-4 py-3 border-b text-center text-gray-700">
                {course.semester}
              </td>
              <td className="px-4 py-3 border-b text-center text-gray-700">
                {course.level}
              </td>
              <td className="px-4 py-3 border-b text-center">
                <button
                  onClick={() => onRemove(gradeScale, index)}
                  className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
                  aria-label="Delete course"
                >
                  <MdDelete className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
