'use client';

import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import { MdAdd } from "react-icons/md";
import useCourses from "@/store/useCourses";
import { useState } from "react";

export default function CourseInputRow() {

  
  const [courseName, setCourseName] = useState('')
  const [grade, setGrade] = useState('')
  const [credit, setCredit] = useState('')
  const [level, setLevel] = useState('')
  const [gradePoint, setGradePoint] = useState('')
  const [semester, setSemester] = useState('')

  const AddCourses = useCourses((state) => state.addCourse)

  const calculateGradePoint = () => {
    if (grade === 'A') {
      setGradePoint(5 * credit);
    } else if (grade === 'B') {
      setGradePoint(4 * credit);
    } else if (grade === 'C') {
      setGradePoint(3 * credit);
    } else if (grade === 'D') {
      setGradePoint(2 * credit);
    } else if (grade === 'E') {
      setGradePoint(1 * credit);
    } else if (grade === 'F') {
      setGradePoint(0 * credit);
    }

    return gradePoint;
  }

  const handleAddClick = async (e) => {
    e.preventDefault();
    calculateGradePoint();
    const res = await fetch('/api/courses/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseName, grade, credit, level, semester, gradePoint }),
    });
    AddCourses({ courseName, grade, credit, level, semester, gradePoint })
  };



  return (
    <div className="container mx-auto shadow-sm rounded-md p-4 mt-4">
    <div className="text-body text-2xl font-bold">
        Input course details
    </div>
    <form className="flex justify-between gap-[1px] items-center bg-background rounded-md py-2 px-4" onSubmit={handleAddClick}>
      <Input label="Course Name or Course Code" id="course-name" onChange={(e) => setCourseName(e.target.value)}/>
      <Select label="Select a Grade" id="Grade" options={["A", "B", "C", "D", "E", "F"]} placeholder="Select a Grade" onChange={(e) => setGrade(e.target.value)}/>
      <Select label="Select a Credit" id="Credit" options={["1", "2", "3", "4", "5", "6"]} placeholder="Select a Credit" onChange={(e) => setCredit(e.target.value)}/>
      <Select label="Select a Level" id="Level" options={["100", "200", "300", "400", "500", "600"]} placeholder="Select a Year" onChange={(e) => setLevel(e.target.value)}/>
      <Select label="Select a Semester" id="Semester" options={["1", "2"]} placeholder="Select a Semester" onChange={(e) => setSemester(e.target.value)}/>
      <button type="submit" className='bg-primary p-2 rounded-md cursor-pointer'><MdAdd color="white" size={30}/></button>
    </form>
    </div>
  );
}
