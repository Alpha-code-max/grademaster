import mongoose from "mongoose";
import  connect  from "@/mongoose.js";

const { coursesConnection } = await connect()// Assuming this is your DB connection utility

const courseSchema = (coursesConnection) => {
    const courseSchema = new mongoose.Schema({
        courseName: String,
        credit: Number,
        grade: String,
        semester: String,
        level: String,
        gradePoint: Number,
    }, {timestamps: true})  
                                 
}


export default createCourseModel;
