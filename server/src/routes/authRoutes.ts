import express, { Router } from 'express';
import { validateRegister, validatePasswordStrength, hashPassword, rateLimit } from '../middleware';
import { register } from '../auth/register';
import { login } from '../auth/login'

const router: Router = express.Router();

router.post('/register',
  rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    maxRequests: 5, 
    message: 'Too many registration attempts' 
  }),
  validateRegister,
  validatePasswordStrength,
  hashPassword,
  register
);

router.post('/login',
  // rateLimit({ 
  //   windowMs: 15 * 60 * 1000, 
  //   maxRequests: 5, 
  //   message: 'Too many login attempts' 
  // }),
  login
);

export default router;