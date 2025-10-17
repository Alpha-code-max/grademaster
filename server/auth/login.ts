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
 * User Login
 * 
 * @route POST /api/auth/login
 * @middleware rateLimit({ windowMs: 15*60*1000, maxRequests: 5 }), validateLogin
 * @access Public
 * 
 * @example
 * // In your routes file:
 * import { rateLimit, validateLogin } from './middleware';
 * import { login } from './controllers/AuthController';
 * 
 * router.post('/login', 
 *   rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5, message: 'Too many login attempts' }), 
 *   validateLogin, 
 *   login
 * );
 * 
 * // Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "SecurePass123!"
 * }
 * 
 * // Success response:
 * {
 *   "success": true,
 *   "message": "Login successful",
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
 *       "lastLoginAt": "2024-10-13T10:30:00.000Z"
 *     },
 *     "tokens": {
 *       "accessToken": "eyJhbGc...",
 *       "refreshToken": "eyJhbGc..."
 *     }
 *   }
 * }
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const User = await getUserModel();
    
    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
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

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
      return;
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Get user without password
    const updatedUser = await User.findById(user._id).select(
      'name email phone role isVerified isActive avatar bio createdAt updatedAt lastLoginAt'
    );

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: updatedUser,
        tokens
      }
    });

  } catch (error: any) {
    console.error('[LOGIN_ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};