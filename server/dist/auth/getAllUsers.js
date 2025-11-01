"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const user_1 = __importDefault(require("../models/user")); // Your Mongoose User model getter
/**
 * Get All Users (with pagination and filters)
 *
 * @route GET /api/users
 * @middleware verifyToken, checkRole('admin', 'moderator')
 * @access Private (Admin/Moderator only)
 *
 * @example
 * // Query parameters:
 * // ?page=1&limit=10&role=user&isVerified=true&search=john
 *
 * router.get('/users', verifyToken, checkRole('admin', 'moderator'), getAllUsers);
 *
 * // Success response:
 * {
 *   "success": true,
 *   "data": {
 *     "users": [...],
 *     "pagination": {
 *       "currentPage": 1,
 *       "totalPages": 5,
 *       "totalUsers": 50,
 *       "limit": 10,
 *       "hasNextPage": true,
 *       "hasPrevPage": false
 *     }
 *   }
 * }
 */
const getAllUsers = async (req, res) => {
    try {
        const { page = '1', limit = '10', role, isVerified, isActive, search } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build filter object
        const filter = {};
        if (role) {
            filter.role = role;
        }
        if (isVerified !== undefined) {
            filter.isVerified = isVerified === 'true';
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        const User = await (0, user_1.default)();
        // Get total count for pagination
        const totalUsers = await User.countDocuments(filter);
        // Fetch users
        const users = await User.find(filter)
            .select('name email phone role isVerified isActive avatar createdAt updatedAt lastLoginAt')
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });
        const totalPages = Math.ceil(totalUsers / limitNum);
        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalUsers,
                    limit: limitNum,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1
                }
            }
        });
    }
    catch (error) {
        console.error('[GET_ALL_USERS_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=getAllUsers.js.map