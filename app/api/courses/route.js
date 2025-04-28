import connect from "@/mongoose";
import createCourseModel from "@/models/course";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { coursesConnection } = await connect();
    const Course = createCourseModel(coursesConnection);
    const courses = await Course.find();
    return NextResponse.json(courses);
}

export async function POST(request) {
    const { coursesConnection } = await connect();
    const Course = createCourseModel(coursesConnection);

    const { courseName, credit, grade, semester, level, gradePoint } = await request.json();
    const course = await Course.create({ courseName, credit, grade, semester, level, gradePoint });
    return NextResponse.json(course);
}

export async function DELETE(request) {
    const { coursesConnection } = await connect();
    const Course = createCourseModel(coursesConnection);
    
    const { id } = await request.json();
    const course = await Course.findByIdAndDelete(id);
    return NextResponse.json(course);
}