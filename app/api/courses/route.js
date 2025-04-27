import connect from "@/mongoose";
import Course from "@/models/course";
import { NextResponse } from "next/server";

export async function GET(request) {
    await connect();
    const courses = await Course.find();
    return NextResponse.json(courses);
}

export async function POST(request) {
    await connect();
    const { courseName, credit, grade, semester, level, gradePoint } = await request.json();
    const course = await Course.create({ courseName, credit, grade, semester, level, gradePoint });
    return NextResponse.json(course);
}

export async function DELETE(request) {
    await connect();
    const { id } = await request.json();
    const course = await Course.findByIdAndDelete(id);
    return NextResponse.json(course);
}