'use client';

import { useState } from "react";
import Input from "./Input";
import Select from "./Select";
import { MdAdd } from "react-icons/md";
import useCourses from "@/store/useCourses";

export default function CourseInputRow() {
  const [courseName, setCourseName] = useState('')
  const [grade, setGrade] = useState('')
  const [credit, setCredit] = useState(0)  // Initialize as number
  const [level, setLevel] = useState('')
  const [semester, setSemester] = useState('')

  const addCourse = useCourses((state) => state.addCourse);

  const isFormComplete = () => {
    return courseName.trim() !== '' && 
           grade !== '' && 
           credit > 0 && 
           level !== '' && 
           semester !== '';
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    if (!isFormComplete()) return;
    
    addCourse({ 
      courseName, 
      grade, 
      credit: Number(credit),
      level, 
      semester 
    });
    
    // Reset form
    setCourseName('');
    setGrade('');
    setCredit(0);
    setLevel('');
    setSemester('');
  };

  const handleCreditChange = (e) => {
    const value = parseInt(e.target.value, 10); // Convert to number
    setCredit(value);
  };

  return (
    <div className="container mx-auto shadow-sm rounded-md p-4 mt-4">
      <div className="text-body text-2xl font-bold">
        Input course details
      </div>
      <form className="text-text flex justify-between gap-[1px] items-center bg-background rounded-md py-2 px-4" onSubmit={handleAddClick}>
        <Input 
          label="Course Name or Course Code" 
          id="course-name" 
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <Select 
          label="Select a Grade" 
          id="Grade" 
          value={grade}
          options={["A", "B", "C", "D", "E", "F"]} 
          placeholder="Select a Grade" 
          onChange={(e) => setGrade(e.target.value)}
        />
        <Select 
          label="Select a Credit" 
          id="Credit" 
          value={credit}
          options={[1, 2, 3, 4, 5, 6]} 
          placeholder="Select a Credit" 
          onChange={handleCreditChange}  // Use new handler
        />
        <Select 
          label="Select a Level" 
          id="Level" 
          value={level}
          options={["100", "200", "300", "400", "500", "600"]} 
          placeholder="Select a Year" 
          onChange={(e) => setLevel(e.target.value)}
        />
        <Select 
          label="Select a Semester" 
          id="Semester" 
          value={semester}
          options={["1st", "2nd"]} 
          placeholder="Select a Semester" 
          onChange={(e) => setSemester(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={!isFormComplete()}
          className={`p-2 rounded-md transition-all duration-300 ${
            isFormComplete() 
              ? 'bg-primary cursor-pointer' 
              : 'bg-gray-400 cursor-not-allowed opacity-50'
          }`}
        >
          <MdAdd color="white" size={30}/>
        </button>
      </form>
    </div>
  );
}
