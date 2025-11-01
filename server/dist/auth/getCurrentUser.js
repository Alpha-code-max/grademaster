"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getCurrentUser = void 0;
const user_1 = __importDefault(require("../models/user")); // Your Mongoose User model getter
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
const getCurrentUser = async (req, res) => {
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
        const User = await (0, user_1.default)();
        const user = await User.findById(userId).select('name email phone role isVerified isActive avatar bio createdAt updatedAt lastLoginAt');
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
    }
    catch (error) {
        console.error('[GET_CURRENT_USER_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.getCurrentUser = getCurrentUser;
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
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const User = await (0, user_1.default)();
        const user = await User.findById(id).select('name email phone role isVerified isActive avatar bio createdAt updatedAt lastLoginAt');
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
    }
    catch (error) {
        console.error('[GET_USER_BY_ID_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.getUserById = getUserById;
//# sourceMappingURL=getCurrentUser.js.map