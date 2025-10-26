import express, { Router } from 'express';
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/course';
import { verifyToken } from '../middleware';

const router: Router = express.Router();

// All routes require authentication
router.post('/', verifyToken, createCourse);
router.get('/', verifyToken, getAllCourses);
router.get('/:id', verifyToken, getCourseById);
router.put('/:id', verifyToken, updateCourse);
router.delete('/:id', verifyToken, deleteCourse);

export default router;