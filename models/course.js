import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseName: String,
    credit: Number,
    grade: String,
    semester: String,
    level: String,
    gradePoint: Number,
}, {timestamps: true})  

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
