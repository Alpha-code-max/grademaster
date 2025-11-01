"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const router = express_1.default.Router();
// Define routes for user-related operations
router.post('/', users_1.createUser); // Create a new user
router.get('/', users_1.getAllUsers); // Get all users
router.get('/:id', users_1.getUserById); // Get a single user by ID
router.put('/:id', users_1.updateUser); // Update a user by ID
router.delete('/:id', users_1.deleteUser); // Delete a user by ID
exports.default = router;
//# sourceMappingURL=usersRoutes.js.map