import { Request, Response } from 'express';
import getUserModel from '../models/user'; // Your Mongoose User model getter
import {
  comparePassword,
  generateTokenPair
} from '../middleware'; // Adjust path as needed

/**
 * Extended Request interface with user data
 */
interface AuthRequest extends Request {
  user?: any;
  userId?: string;
}

/**
 * Get Current User Profile
 * 
 * @route GET /api/auth/me
 * @middleware verifyToken
 * @access Private
 * 
 * @example
 * // In your routes file:
 * import { verifyToken } from './middleware';
 * import { getCurrentUser } from './controllers/GetUser';
 * 
 * router.get('/me', verifyToken, getCurrentUser);
 * 
 * // Request headers:
 * {
 *   "Authorization": "Bearer eyJhbGc..."
 * }
 * 
 * // Success response:
 * {
 *   "success": true,
 *   "data": {
 *     "user": {
 *       "id": "user-uuid",
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "phone": "+1234567890",
 *       "role": "user",
 *       "isVerified": true,
 *       "isActive": true,
 *       "avatar": "https://...",
 *       "bio": "Software developer",
 *       "createdAt": "2024-01-15T10:30:00.000Z",
 *       "updatedAt": "2024-01-15T10:30:00.000Z",
 *       "lastLoginAt": "2024-01-15T10:30:00.000Z"
 *     }
 *   }
 * }
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
      return;
    }

    const User = await getUserModel();
    const user = await User.findById(userId).select(
      'name email phone role isVerified isActive avatar bio createdAt updatedAt lastLoginAt'
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error: any) {
    console.error('[GET_CURRENT_USER_ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get User By ID
 * 
 * @route GET /api/users/:id
 * @middleware verifyToken, checkRole('admin')
 * @access Private (Admin only)
 * 
 * @example
 * router.get('/users/:id', verifyToken, checkRole('admin'), getUserById);
 * 
 * // Success response:
 * {
 *   "success": true,
 *   "data": {
 *     "user": { ... }
 *   }
 * }
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const User = await getUserModel();
    const user = await User.findById(id).select(
      'name email phone role isVerified isActive avatar bio createdAt updatedAt lastLoginAt'
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error: any) {
    console.error('[GET_USER_BY_ID_ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
