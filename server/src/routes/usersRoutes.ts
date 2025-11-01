import express, { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/users';

const router: Router = express.Router();

// Define routes for user-related operations
router.post('/', createUser); // Create a new user
router.get('/', getAllUsers); // Get all users
router.get('/:id', getUserById); // Get a single user by ID
router.put('/:id', updateUser); // Update a user by ID
router.delete('/:id', deleteUser); // Delete a user by ID

export default router;