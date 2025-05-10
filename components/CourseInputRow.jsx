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
  const [semester, setSemester] = useState('') // Initialize as number

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
    <div className="container mx-auto shadow-sm rounded-md p-2 md:p-4 mt-2 md:mt-4 w-screen">
      <div className="text-body text-center text-xl md:text-2xl font-bold mb-2 md:mb-4">
        Input course details
      </div>
      
      <form className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center rounded-md py-2 px-2 md:px-4 justify-between" 
        onSubmit={handleAddClick}
      >
        <Input 
          label="Course Name or Code" 
          id="course-name" 
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2 text-black"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full md:w-auto">
          <Select 
            label="Grade" 
            id="Grade" 
            value={grade}
            options={["A", "B", "C", "D", "E", "F"]} 
            placeholder="Grade" 
            onChange={(e) => setGrade(e.target.value)}
            className="w-full"
          />
          <Select 
            label="Credit" 
            id="Credit" 
            value={credit}
            options={[1, 2, 3, 4, 5, 6]} 
            placeholder="Credit" 
            onChange={handleCreditChange}
            className="w-full"
          />
          <Select 
            label="Level" 
            id="Level" 
            value={level}
            options={["100", "200", "300", "400", "500", "600"]} 
            placeholder="Level" 
            onChange={(e) => setLevel(e.target.value)}
            className="w-full"
          />
          <Select 
            label="Semester" 
            id="Semester" 
            value={semester}
            options={["1st", "2nd"]} 
            placeholder="Semester" 
            onChange={(e) => setSemester(e.target.value)}
            className="w-full"
          />
{/* 
          <Select 
            label="Courses Per Semester"
            id="CoursesPerSemester" 
            value={courseperSemester}
            options={[...Array(20).keys()].map(i => i + 1)} // Generate numbers 1 to 20
            placeholder="Courses Per Semester" 
            onChange={(e) => setSemester(e.target.value)}
            className="w-full"
          /> */}
        </div>

        <button 
          type="submit" 
          disabled={!isFormComplete()}
          className={`w-full md:w-auto p-2 md:p-3 rounded-md transition-all duration-300 mt-2 md:mt-0 ${
            isFormComplete() 
              ? 'bg-primary cursor-pointer hover:bg-primary/80' 
              : 'bg-gray-400 cursor-not-allowed opacity-50'
          }`}
        >
          <MdAdd color="white" size={24} className="mx-auto"/>
        </button>
      </form>
    </div>
  );
}
