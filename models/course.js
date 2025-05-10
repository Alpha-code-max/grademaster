import mongoose from "mongoose";
import connect from "@/mongoose.js";

const courseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courses: [{
        courseName: {
            type: String,
            required: true
        },
        credit: {
            type: Number,
            required: true
        },
        grade: {
            type: String,
            required: true
        },
        semester: {
            type: String,
            required: true
        },
        level: {
            type: String,
            required: true
        }
    }],
    gradePoint: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const getCourseModel = async () => {
    try {
        await connect();
        return mongoose.models.Course || mongoose.model('Course', courseSchema);
    } catch (error) {
        console.error('Error creating course model:', error);
        throw error;
    }
};

export default getCourseModel;
