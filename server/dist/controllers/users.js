"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const user_1 = __importDefault(require("../models/user"));
// Create a new user
const createUser = async (req, res) => {
    try {
        const User = await (0, user_1.default)();
        const userData = req.body;
        // Basic input validation
        if (!userData.name || !userData.email || !userData.password) {
            return res.status(400).json({
                message: 'Missing required fields: name, email, or password',
            });
        }
        const user = await User.create(userData);
        res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        console.error('User creation error:', error);
        res.status(500).json({
            message: 'Failed to create user',
            error: error.message,
        });
    }
};
exports.createUser = createUser;
// Fetch all users
const getAllUsers = async (_req, res) => {
    try {
        const User = await (0, user_1.default)();
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    }
    catch (error) {
        console.error('User fetch error:', error);
        res.status(500).json({
            message: 'Failed to fetch users',
            error: error.message,
        });
    }
};
exports.getAllUsers = getAllUsers;
// Fetch a user by ID
const getUserById = async (req, res) => {
    try {
        const User = await (0, user_1.default)();
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        res.json(user);
    }
    catch (error) {
        console.error('User fetch by ID error:', error);
        res.status(500).json({
            message: 'Failed to fetch user',
            error: error.message,
        });
    }
};
exports.getUserById = getUserById;
// Update a user by ID
const updateUser = async (req, res) => {
    try {
        const User = await (0, user_1.default)();
        const updateData = req.body;
        // Remove password from update if present (handle separately for security)
        delete updateData.password;
        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        res.json({
            message: 'User updated successfully',
            user,
        });
    }
    catch (error) {
        console.error('User update error:', error);
        res.status(500).json({
            message: 'Failed to update user',
            error: error.message,
        });
    }
};
exports.updateUser = updateUser;
// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const User = await (0, user_1.default)();
        const user = await User.findByIdAndDelete(req.params.id);
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
    }
    catch (error) {
        console.error('User delete error:', error);
        res.status(500).json({
            message: 'Failed to delete user',
            error: error.message,
        });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=users.js.map