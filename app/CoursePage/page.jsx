import CourseInputRow from "@/components/CourseInputRow";
import Table from "@/components/Table";
import NavBar from "@/components/NavBar";

export default function CoursePage (){
    return (
        <div className="bg-background">
            <div className="bg-background mb-10">
                <NavBar />
            </div>
            <div className="heading text-center my-10">
                Course Page
            </div>
            <CourseInputRow />
            <div className="body text-center my-10">
                Please remember to put in the courses in their accurate order
            </div>
            <Table />
        </div>
    )
}