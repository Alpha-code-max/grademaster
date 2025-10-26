import CourseInputRow from "@/components/CourseInputRow";
import NavBar from "@/components/NavBar";



const CoursePage = () => {
  return (
    <div>
      <div className="container mb-32 px-4">
        <NavBar />
      </div>
      <CourseInputRow />
    </div>
  );
};

export default CoursePage;