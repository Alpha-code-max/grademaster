"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourse = createCourse;
exports.getAllCourses = getAllCourses;
exports.getCourseById = getCourseById;
exports.deleteCourse = deleteCourse;
exports.updateCourse = updateCourse;
const mongoose_1 = __importDefault(require("mongoose"));
const course_1 = __importDefault(require("../models/course"));
// Create a new course
async function createCourse(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized: User ID not found in request',
            });
        }
        const courseData = req.body;
        // Validate required fields
        if (!courseData.courses || !courseData.gpaScale) {
            return res.status(400).json({
                message: 'Missing required fields: courses or gpaScale',
            });
        }
        // Validate courses array
        if (!Array.isArray(courseData.courses) || courseData.courses.length === 0) {
            return res.status(400).json({
                message: 'Courses must be a non-empty array',
            });
        }
        // Convert userId to ObjectId
        courseData.userId = new mongoose_1.default.Types.ObjectId(userId);
        const course = new course_1.default(courseData);
        await course.save(); // Pre-save hook calculates gradePoint and updates cgpaHistory
        res.status(201).json({
            message: 'Course created successfully',
            course,
            gpa: course.gradePoint,
            cgpaHistory: course.cgpaHistory,
        });
    }
    catch (error) {
        console.error('Course creation error:', error);
        res.status(500).json({
            message: 'Failed to create course',
            error: error.message,
        });
    }
}
// Fetch all courses for the authenticated user
async function getAllCourses(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized: User ID not found in request',
            });
        }
        const courses = await course_1.default.find({
            userId: new mongoose_1.default.Types.ObjectId(userId),
        })
            .sort({ createdAt: -1 })
            .select('courses gradePoint gpaScale cgpaHistory');
        res.status(200).json({
            message: 'Courses retrieved successfully',
            courses,
        });
    }
    catch (error) {
        console.error('Course fetch error:', error);
        res.status(500).json({
            message: 'Failed to fetch courses',
            error: error.message,
        });
    }
}
// Fetch a course by ID for the authenticated user
async function getCourseById(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized: User ID not found in request',
            });
        }
        const course = await course_1.default.findOne({
            _id: req.params.id,
            userId: new mongoose_1.default.Types.ObjectId(userId),
        }).select('courses gradePoint gpaScale cgpaHistory');
        if (!course) {
            return res.status(404).json({
                message: 'Course not found or not authorized',
            });
        }
        res.status(200).json({
            message: 'Course retrieved successfully',
            course,
            gpa: course.gradePoint,
            cgpaHistory: course.cgpaHistory,
        });
    }
    catch (error) {
        console.error('Course fetch by ID error:', error);
        res.status(500).json({
            message: 'Failed to fetch course',
            error: error.message,
        });
    }
}
// Delete a course by ID for the authenticated user
async function deleteCourse(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized: User ID not found in request',
            });
        }
        const course = await course_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        if (!course) {
            return res.status(404).json({
                message: 'Course not found or not authorized',
            });
        }
        res.status(200).json({
            message: 'Course deleted successfully',
            course,
        });
    }
    catch (error) {
        console.error('Course deletion error:', error);
        res.status(500).json({
            message: 'Failed to delete course',
            error: error.message,
        });
    }
}
// Update a course by ID for the authenticated user
async function updateCourse(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized: User ID not found in request',
            });
        }
        const courseData = req.body;
        // Prevent updating userId
        delete courseData.userId;
        // Validate courses array if provided
        if (courseData.courses && (!Array.isArray(courseData.courses) || courseData.courses.length === 0)) {
            return res.status(400).json({
                message: 'Courses must be a non-empty array',
            });
        }
        const updatedCourse = await course_1.default.findOneAndUpdate({ _id: req.params.id, userId: new mongoose_1.default.Types.ObjectId(userId) }, courseData, { new: true, runValidators: true });
        if (!updatedCourse) {
            return res.status(404).json({
                message: 'Course not found or not authorized',
            });
        }
        res.status(200).json({
            message: 'Course updated successfully',
            course: updatedCourse,
            gpa: updatedCourse.gradePoint,
            cgpaHistory: updatedCourse.cgpaHistory,
        });
    }
    catch (error) {
        console.error('Course update error:', error);
        res.status(500).json({
            message: 'Failed to update course',
            error: error.message,
        });
    }
}
//# sourceMappingURL=course.js.map