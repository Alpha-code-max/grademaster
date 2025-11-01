"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.generateTokenPair = exports.generateRefreshToken = exports.generateToken = exports.comparePassword = exports.securityHeaders = exports.sanitizeInput = exports.checkRole = exports.rateLimit = exports.verifyToken = exports.hashPassword = exports.validateLogin = exports.validatePasswordStrength = exports.validateRegister = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Add this at the very top of middleware.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
// ============================================
// CONFIGURATION
// ============================================
// Ensure it reads the .env file from the root of the project
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET must be set in environment variables");
}
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "1h");
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');
// ============================================
// CONSTANTS & REGEX
// ============================================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const NAME_MIN_LENGTH = 2;
// ============================================
// VALIDATION MIDDLEWARE
// ============================================
const validateRegister = (req, res, next) => {
    if (!req.body) {
        res.status(400).json({
            success: false,
            message: 'Request body is empty'
        });
        return;
    }
    const { name, email, password, confirmPassword } = req.body;
    // Check required fields
    if (!name?.trim() || !email?.trim() || !password) {
        res.status(400).json({
            success: false,
            message: 'Name, email, and password are required'
        });
        return;
    }
    // Validate name
    const trimmedName = name.trim();
    if (trimmedName.length < NAME_MIN_LENGTH || trimmedName.length > 100) {
        res.status(400).json({
            success: false,
            message: `Name must be between ${NAME_MIN_LENGTH} and 100 characters`
        });
        return;
    }
    // Validate email
    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
        res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
        return;
    }
    // Validate password
    if (password.length < PASSWORD_MIN_LENGTH) {
        res.status(400).json({
            success: false,
            message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
        });
        return;
    }
    // Check password confirmation
    if (confirmPassword && password !== confirmPassword) {
        res.status(400).json({
            success: false,
            message: 'Passwords do not match'
        });
        return;
    }
    // Update body with sanitized values
    req.body.name = trimmedName;
    req.body.email = trimmedEmail;
    next();
};
exports.validateRegister = validateRegister;
const validatePasswordStrength = (req, res, next) => {
    const { password } = req.body;
    if (!password) {
        res.status(400).json({
            success: false,
            message: 'Password is required'
        });
        return;
    }
    const requirements = {
        minLength: password.length >= PASSWORD_MIN_LENGTH,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)
    };
    const failed = [];
    if (!requirements.minLength)
        failed.push(`at least ${PASSWORD_MIN_LENGTH} characters`);
    if (!requirements.hasUpperCase)
        failed.push('uppercase letter');
    if (!requirements.hasLowerCase)
        failed.push('lowercase letter');
    if (!requirements.hasNumber)
        failed.push('number');
    if (!requirements.hasSpecialChar)
        failed.push('special character');
    if (failed.length > 0) {
        res.status(400).json({
            success: false,
            message: 'Password must contain: ' + failed.join(', ')
        });
        return;
    }
    next();
};
exports.validatePasswordStrength = validatePasswordStrength;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
        res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
        return;
    }
    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
        res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
        return;
    }
    req.body.email = trimmedEmail;
    next();
};
exports.validateLogin = validateLogin;
// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
const hashPassword = async (req, res, next) => {
    const { password } = req.body;
    if (!password) {
        res.status(400).json({
            success: false,
            message: 'Password is required'
        });
        return;
    }
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, BCRYPT_ROUNDS);
        req.body.hashedPassword = hashedPassword;
        delete req.body.password;
        delete req.body.confirmPassword;
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing password'
        });
    }
};
exports.hashPassword = hashPassword;
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            message: 'No valid token provided',
            code: 'NO_TOKEN'
        });
        return;
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        }
    }
};
exports.verifyToken = verifyToken;
// ============================================
// RATE LIMITING
// ============================================
const rateLimitStore = new Map();
const rateLimit = (options) => {
    return (req, res, next) => {
        const identifier = (req.ip || 'unknown');
        const key = `${identifier}:${req.path}`;
        const now = Date.now();
        // Clean expired entry
        const entry = rateLimitStore.get(key);
        if (entry && now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
        // Initialize or increment
        if (!rateLimitStore.has(key)) {
            rateLimitStore.set(key, {
                count: 1,
                resetTime: now + options.windowMs
            });
            next();
            return;
        }
        const current = rateLimitStore.get(key);
        current.count++;
        if (current.count > options.maxRequests) {
            const retryAfter = Math.ceil((current.resetTime - now) / 1000);
            res.status(429).json({
                success: false,
                message: options.message || 'Too many requests',
                retryAfter
            });
            return;
        }
        next();
    };
};
exports.rateLimit = rateLimit;
// ============================================
// AUTHORIZATION
// ============================================
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Access denied: insufficient permissions'
            });
            return;
        }
        next();
    };
};
exports.checkRole = checkRole;
// ============================================
// SECURITY
// ============================================
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj.trim().replace(/[<>]/g, '');
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        if (obj && typeof obj === 'object') {
            const result = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result[key] = sanitize(obj[key]);
                }
            }
            return result;
        }
        return obj;
    };
    req.body = sanitize(req.body);
    next();
};
exports.sanitizeInput = sanitizeInput;
const securityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
};
exports.securityHeaders = securityHeaders;
// ============================================
// UTILITIES
// ============================================
const comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt_1.default.compare(plainPassword, hashedPassword);
};
exports.comparePassword = comparePassword;
const generateToken = (payload) => {
    const options = { expiresIn: JWT_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateToken = generateToken;
const generateRefreshToken = (payload) => {
    const options = { expiresIn: JWT_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateRefreshToken = generateRefreshToken;
const generateTokenPair = (payload) => {
    return {
        accessToken: (0, exports.generateToken)(payload),
        refreshToken: (0, exports.generateRefreshToken)(payload)
    };
};
exports.generateTokenPair = generateTokenPair;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=middleware.js.map