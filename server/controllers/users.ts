import { Request, Response } from 'express';
import getUserModel, { IUserDocument } from '../models/user';

// Create a new user
const createUser = async (req: Request, res: Response) => {
  try {
    const User = await getUserModel();
    const userData: Partial<IUserDocument> = req.body;

    // Basic input validation
    if (!userData.name || !userData.email || !userData.password) {
      return res.status(400).json({
        message: 'Missing required fields: name, email, or password',
      });
    }

    const user: IUserDocument = await User.create(userData);
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('User creation error:', error);
    res.status(500).json({
      message: 'Failed to create user',
      error: error.message,
    });
  }
};

// Fetch all users
const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const User = await getUserModel();
    const users: IUserDocument[] = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error: any) {
    console.error('User fetch error:', error);
    res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// Fetch a user by ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const User = await getUserModel();
    const user: IUserDocument | null = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json(user);
  } catch (error: any) {
    console.error('User fetch by ID error:', error);
    res.status(500).json({
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

// Update a user by ID
const updateUser = async (req: Request, res: Response) => {
  try {
    const User = await getUserModel();
    const updateData: Partial<IUserDocument> = req.body;

    // Remove password from update if present (handle separately for security)
    delete updateData.password;

    const user: IUserDocument | null = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({
      message: 'User updated successfully',
      user,
    });
  } catch (error: any) {
    console.error('User update error:', error);
    res.status(500).json({
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

// Delete a user by ID
const deleteUser = async (req: Request, res: Response) => {
  try {
    const User = await getUserModel();
    const user: IUserDocument | null = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({
      message: 'User deleted successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('User delete error:', error);
    res.status(500).json({
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};