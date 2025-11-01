"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const register_1 = require("../auth/register");
const login_1 = require("../auth/login");
const router = express_1.default.Router();
router.post('/register', (0, middleware_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    message: 'Too many registration attempts'
}), middleware_1.validateRegister, middleware_1.validatePasswordStrength, middleware_1.hashPassword, register_1.register);
router.post('/login', 
// rateLimit({ 
//   windowMs: 15 * 60 * 1000, 
//   maxRequests: 5, 
//   message: 'Too many login attempts' 
// }),
login_1.login);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map