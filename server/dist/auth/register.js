"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const user_1 = __importDefault(require("../models/user")); // Your Mongoose User model getter
const middleware_1 = require("../middleware"); // Adjust path as needed
/**
 * Register New User
 *
 * @route POST /api/auth/register
 * @middleware validateRegister, validatePasswordStrength, hashPassword, rateLimit({ windowMs: 15*60*1000, maxRequests: 5 })
 * @access Public
 *
 * @example
 * // In your routes file:
 * import { validateRegister, validatePasswordStrength, hashPassword, rateLimit } from './middleware';
 * import { register } from './controllers/AuthController';
 *
 * router.post('/register',
 *   rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5, message: 'Too many registration attempts' }),
 *   validateRegister,
 *   validatePasswordStrength,
 *   hashPassword,
 *   register
 * );
 *
 * // Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "SecurePass123!",
 *   "confirmPassword": "SecurePass123!",
 *   "phone": "+1234567890"
 * }
 *
 * // Success response:
 * {
 *   "success": true,
 *   "message": "User registered successfully",
 *   "data": {
 *     "user": {
 *       "id": "user-uuid",
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "phone": "+1234567890",
 *       "role": "user",
 *       "isVerified": false,
 *       "isActive": true,
 *       "avatar": null,
 *       "bio": null,
 *       "createdAt": "2024-01-15T10:30:00.000Z",
 *       "updatedAt": "2024-01-15T10:30:00.000Z",
 *       "lastLoginAt": null
 *     },
 *     "tokens": {
 *       "accessToken": "eyJhbGc...",
 *       "refreshToken": "eyJhbGc..."
 *     }
 *   }
 * }
 */
const register = async (req, res) => {
    try {
        const { name, email, phone, hashedPassword } = req.body;
        const User = await (0, user_1.default)();
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'User already exists with this email',
                code: 'USER_EXISTS'
            });
            return;
        }
        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            role: 'user',
            isVerified: false,
            isActive: true,
            avatar: null,
            bio: null
        });
        // Get user without password
        const userResponse = await User.findById(newUser._id).select('name email phone role isVerified isActive avatar bio createdAt updatedAt lastLoginAt');
        // Generate tokens
        const tokens = (0, middleware_1.generateTokenPair)({
            userId: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse,
                tokens
            }
        });
    }
    catch (error) {
        console.error('[REGISTER_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.register = register;
//# sourceMappingURL=register.js.map