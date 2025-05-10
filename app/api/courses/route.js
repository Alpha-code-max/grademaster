import { NextResponse } from "next/server";
import getCourseModel from "@/models/course";

export async function POST(request) {
    try {
        const Course = await getCourseModel();
        const courseData = await request.json();

        const course = await Course.create(courseData);
        
        return NextResponse.json(
            { message: "Course created successfully", course },
            { status: 201 }
        );
    } catch (error) {
        console.error("Course creation error:", error);
        return NextResponse.json(
            { message: "Failed to create course" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const Course = await getCourseModel();
        const courses = await Course.find({}).sort({ createdAt: -1 });
        
        return NextResponse.json(courses);
    } catch (error) {
        console.error("Course fetch error:", error);
        return NextResponse.json(
            { message: "Failed to fetch courses" },
            { status: 500 }
        );
    }
}

// export async function DELETE(request) {
//     const { coursesConnection } = await connect();
//     const Course = createCourseModel(coursesConnection);
    
//     const { id } = await request.json();
//     const course = await Course.findByIdAndDelete(id);
//     return NextResponse.json(course);
// }