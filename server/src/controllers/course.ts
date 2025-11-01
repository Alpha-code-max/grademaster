import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Course, { ICourseDocument } from '../models/course';

// Extend Request interface to include user
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
  };
}

// Create a new course
export async function createCourse(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized: User ID not found in request',
      });
    }

    const courseData: Partial<ICourseDocument> = req.body;

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
    courseData.userId = new mongoose.Types.ObjectId(userId);

    const course = new Course(courseData);
    await course.save(); // Pre-save hook calculates gradePoint and updates cgpaHistory

    res.status(201).json({
      message: 'Course created successfully',
      course,
      gpa: course.gradePoint,
      cgpaHistory: course.cgpaHistory,
    });
  } catch (error: any) {
    console.error('Course creation error:', error);
    res.status(500).json({
      message: 'Failed to create course',
      error: error.message,
    });
  }
}

// Fetch all courses for the authenticated user
export async function getAllCourses(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized: User ID not found in request',
      });
    }

    const courses: ICourseDocument[] = await Course.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .select('courses gradePoint gpaScale cgpaHistory');

    res.status(200).json({
      message: 'Courses retrieved successfully',
      courses,
    });
  } catch (error: any) {
    console.error('Course fetch error:', error);
    res.status(500).json({
      message: 'Failed to fetch courses',
      error: error.message,
    });
  }
}

// Fetch a course by ID for the authenticated user
export async function getCourseById(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized: User ID not found in request',
      });
    }

    const course: ICourseDocument | null = await Course.findOne({
      _id: req.params.id,
      userId: new mongoose.Types.ObjectId(userId),
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
  } catch (error: any) {
    console.error('Course fetch by ID error:', error);
    res.status(500).json({
      message: 'Failed to fetch course',
      error: error.message,
    });
  }
}

// Delete a course by ID for the authenticated user
export async function deleteCourse(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized: User ID not found in request',
      });
    }

    const course: ICourseDocument | null = await Course.findOneAndDelete({
      _id: req.params.id,
      userId: new mongoose.Types.ObjectId(userId),
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
  } catch (error: any) {
    console.error('Course deletion error:', error);
    res.status(500).json({
      message: 'Failed to delete course',
      error: error.message,
    });
  }
}

// Update a course by ID for the authenticated user
export async function updateCourse(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized: User ID not found in request',
      });
    }

    const courseData: Partial<ICourseDocument> = req.body;

    // Prevent updating userId
    delete courseData.userId;

    // Validate courses array if provided
    if (courseData.courses && (!Array.isArray(courseData.courses) || courseData.courses.length === 0)) {
      return res.status(400).json({
        message: 'Courses must be a non-empty array',
      });
    }

    const updatedCourse: ICourseDocument | null = await Course.findOneAndUpdate(
      { _id: req.params.id, userId: new mongoose.Types.ObjectId(userId) },
      courseData,
      { new: true, runValidators: true }
    );

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
  } catch (error: any) {
    console.error('Course update error:', error);
    res.status(500).json({
      message: 'Failed to update course',
      error: error.message,
    });
  }
}