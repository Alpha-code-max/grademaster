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
 * Update User Profile
 * 
 * @route PUT /api/auth/profile
 * @middleware verifyToken, validateProfileUpdate
 * @access Private
 * 
 * @example
 * router.put('/profile', verifyToken, validateProfileUpdate, updateProfile);
 * 
 * // Request body:
 * {
 *   "name": "John Updated",
 *   "bio": "Updated bio",
 *   "phone": "+1234567890",
 *   "avatar": "https://example.com/avatar.jpg"
 * }
 * 
 * // Success response:
 * {
 *   "success": true,
 *   "message": "Profile updated successfully",
 *   "data": {
 *     "user": { ... }
 *   }
 * }
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { name, bio, phone, avatar } = req.body;

    // Build update object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    const User = await getUserModel();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('name email phone role isVerified isActive avatar bio createdAt updatedAt lastLoginAt');

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });

  } catch (error: any) {
    console.error('[UPDATE_PROFILE_ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};