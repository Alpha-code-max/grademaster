import dotenv from 'dotenv';
dotenv.config(); // Add this at the very top of middleware.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ============================================
// CONFIGURATION
// ============================================

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in environment variables');
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

// ============================================
// CONSTANTS & REGEX
// ============================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const NAME_MIN_LENGTH = 2;

// ============================================
// INTERFACES
// ============================================

interface AuthRequest extends Request {
  user?: any;
  userId?: string;
}

interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
  [key: string]: any;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

export const validatePasswordStrength = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

  const failed: string[] = [];
  if (!requirements.minLength) failed.push(`at least ${PASSWORD_MIN_LENGTH} characters`);
  if (!requirements.hasUpperCase) failed.push('uppercase letter');
  if (!requirements.hasLowerCase) failed.push('lowercase letter');
  if (!requirements.hasNumber) failed.push('number');
  if (!requirements.hasSpecialChar) failed.push('special character');

  if (failed.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Password must contain: ' + failed.join(', ')
    });
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

export const hashPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { password } = req.body;

  if (!password) {
    res.status(400).json({
      success: false,
      message: 'Password is required'
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    req.body.hashedPassword = hashedPassword;
    delete req.body.password;
    delete req.body.confirmPassword;
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error processing password'
    });
  }
};

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
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
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
  }
};

// ============================================
// RATE LIMITING
// ============================================

const rateLimitStore = new Map<string, RateLimitEntry>();

export const rateLimit = (options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const identifier = (req.ip || 'unknown') as string;
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

    const current = rateLimitStore.get(key)!;
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

// ============================================
// AUTHORIZATION
// ============================================

export const checkRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
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

// ============================================
// SECURITY
// ============================================

export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/[<>]/g, '');
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const result: any = {};
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

export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
};

// ============================================
// UTILITIES
// ============================================

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN
  });
};

export const generateTokenPair = (payload: TokenPayload) => {
  return {
    accessToken: generateToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};