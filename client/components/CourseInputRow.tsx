'use client';

import { useState } from 'react';
import { useCourseStore } from '@/store/courseStore';
import { Trash2, PlusCircle, Calculator, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ------------------- Grade Point Scales -------------------
const GRADE_SCALE_5: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
};

const GRADE_SCALE_4: Record<string, number> = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  F: 0,
};

// ------------------- Types -------------------
interface Course {
  courseName: string;
  credit: number;
  grade: string;
  semester: string;
  level: string;
}

interface CourseGroup {
  gradeScale: '4' | '5';
  courses: Course[];
  cgpa: number;
}

// ------------------- Component -------------------
export default function GPAInput() {
  const { localCourses, setLocalCourses } = useCourseStore();
  const [courseName, setCourseName] = useState('');
  const [credit, setCredit] = useState<number>(0);
  const [grade, setGrade] = useState('');
  const [gradeScale, setGradeScale] = useState<'4' | '5' | ''>('');
  const [semester, setSemester] = useState('');
  const [level, setLevel] = useState('');
  const [calculatedGPA, setCalculatedGPA] = useState<number | null>(null);

  // Reset all inputs
  const clearInputs = () => {
    setCourseName('');
    setCredit(0);
    setGrade('');
    setGradeScale('');
    setSemester('');
    setLevel('');
  };

  // Compute CGPA for a group
  const computeGroupCGPA = (courses: Course[], scale: '4' | '5') => {
    const gradeMap = scale === '5' ? GRADE_SCALE_5 : GRADE_SCALE_4;
    let totalGradePoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      const gradePoint = gradeMap[course.grade] ?? 0;
      totalGradePoints += gradePoint * course.credit;
      totalCredits += course.credit;
    });

    return totalCredits > 0 ? Number((totalGradePoints / totalCredits).toFixed(2)) : 0;
  };

  // Add a course
  const handleAddCourse = () => {
    if (!courseName || !credit || !grade || !gradeScale || !semester || !level) {
      alert('Please fill in all fields before adding a course.');
      return;
    }

    const newCourse: Course = { courseName, credit, grade, semester, level };
    let updatedGroups = [...localCourses];
    const existingGroupIndex = updatedGroups.findIndex((g) => g.gradeScale === gradeScale);

    if (existingGroupIndex >= 0) {
      const group = updatedGroups[existingGroupIndex];
      group.courses.push(newCourse);
      group.cgpa = computeGroupCGPA(group.courses, group.gradeScale);
      updatedGroups[existingGroupIndex] = { ...group };
    } else {
      updatedGroups.push({
        gradeScale,
        courses: [newCourse],
        cgpa: computeGroupCGPA([newCourse], gradeScale),
      });
    }

    setLocalCourses(updatedGroups);
    clearInputs();
  };

  // Remove a course
  const handleRemoveCourse = (scale: '4' | '5', index: number) => {
    const updatedGroups = localCourses.map((group) => {
      if (group.gradeScale === scale) {
        const newCourses = group.courses.filter((_, i) => i !== index);
        return {
          ...group,
          courses: newCourses,
          cgpa: computeGroupCGPA(newCourses, scale),
        };
      }
      return group;
    });
    setLocalCourses(updatedGroups.filter((g) => g.courses.length > 0));
  };

  // Calculate total GPA
  const calculateGPA = () => {
    if (localCourses.length === 0) {
      alert('Please add at least one course.');
      return;
    }

    let totalGradePoints = 0;
    let totalCredits = 0;

    localCourses.forEach((group) => {
      const scale = group.gradeScale === '5' ? GRADE_SCALE_5 : GRADE_SCALE_4;
      group.courses.forEach((course) => {
        const gradePoint = scale[course.grade] ?? 0;
        totalGradePoints += gradePoint * course.credit;
        totalCredits += course.credit;
      });
    });

    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    setCalculatedGPA(Number(gpa.toFixed(2)));
  };

  const getClassification = (gpa: number, scale: string) => {
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

  // ------------------- PDF Download -------------------
  const handleDownloadPDF = async () => {
    const element = document.getElementById('gpa-summary');
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      useCORS: true,
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('GPA_Report.pdf');
  };

  // ------------------- UI -------------------
  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">📘 GPA Calculator</h1>

      {/* Input Form */}
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Enter Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Credit Units"
            value={credit || ''}
            onChange={(e) => setCredit(Number(e.target.value))}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select Grade</option>
            {['A', 'B', 'C', 'D', 'E', 'F'].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={gradeScale}
            onChange={(e) => setGradeScale(e.target.value as '4' | '5')}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select Grading Scale</option>
            <option value="4">4-Point Scale</option>
            <option value="5">5-Point Scale</option>
          </select>
          <input
            type="text"
            placeholder="Semester (e.g. First, Second)"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Level (e.g. 100L)"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleAddCourse}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <PlusCircle size={18} /> Add Course
          </button>
        </div>
      </div>

      {/* GPA Summary Section (for PDF export) */}
      <div id="gpa-summary" className="bg-white space-y-6 p-6 rounded-lg shadow-inner">
        {localCourses.map((group) => (
          <div key={group.gradeScale} className="border rounded-xl bg-gray-50 p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              {group.gradeScale}-Point Scale — CGPA:{' '}
              <span className="text-blue-600 font-bold">{group.cgpa}</span>
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-2 border">Course</th>
                  <th className="p-2 border">Credit</th>
                  <th className="p-2 border">Grade</th>
                  <th className="p-2 border">Semester</th>
                  <th className="p-2 border">Level</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {group.courses.map((course, index) => (
                  <tr key={index} className="text-center hover:bg-gray-50 transition">
                    <td className="border p-2">{course.courseName}</td>
                    <td className="border p-2">{course.credit}</td>
                    <td className="border p-2">{course.grade}</td>
                    <td className="border p-2">{course.semester}</td>
                    <td className="border p-2">{course.level}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleRemoveCourse(group.gradeScale, index)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* GPA Result */}
        {calculatedGPA !== null && (
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-semibold text-gray-800">
              🎯 Overall GPA: <span className="text-green-600">{calculatedGPA}</span>
            </h3>
            <p className="text-gray-600 mt-1">{getClassification(calculatedGPA, '5')}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={calculateGPA}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          <Calculator size={18} /> Calculate GPA
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition shadow-sm"
        >
          <Download size={18} /> Download PDF
        </button>
      </div>
    </div>
  );
}
