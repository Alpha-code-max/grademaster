import express, { Router } from 'express';
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/course';
import { verifyToken } from '../middleware';
const router: Router = express.Router();

// Define routes for user-related operations
router.post('/', createCourse); // Create a new course
router.get('/', getAllCourses); // Get all courses
router.get('/:id', getCourseById); // Get a single course by ID
router.put('/:id', updateCourse); // Update a course by ID
router.delete('/:id', deleteCourse); // Delete a course by ID

export default router;