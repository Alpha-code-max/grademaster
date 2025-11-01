"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = void 0;
const user_1 = __importDefault(require("../models/user")); // Your Mongoose User model getter
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
const updateProfile = async (req, res) => {
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
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (bio !== undefined)
            updateData.bio = bio;
        if (phone !== undefined)
            updateData.phone = phone;
        if (avatar !== undefined)
            updateData.avatar = avatar;
        const User = await (0, user_1.default)();
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true }).select('name email phone role isVerified isActive avatar bio createdAt updatedAt lastLoginAt');
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
    }
    catch (error) {
        console.error('[UPDATE_PROFILE_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=updateUserProfile.js.map