import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import courseRouter from './routes/courseRoutes';
import userRouter from './routes/usersRoutes';
import authRouter from './routes/authRoutes';

const app: Express = express();

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const mongoUri = process.env.MONGO_URI;
const exitOnDbError = process.env.EXIT_ON_DB_ERROR !== 'false';
let isDbConnected = false;

if (!mongoUri) {
  throw new Error('MONGO_URI must be set in environment variables');
}

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware - Order matters!
// 1. CORS middleware FIRST
app.use(cors(corsOptions));

// 2. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Logging middleware (after parsers, before routes)
app.use((req: Request, res: Response, next: express.NextFunction) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', {
    contentType: req.headers['content-type'],
    authorization: req.headers['authorization'] ? 'Bearer [token]' : 'none',
    origin: req.headers['origin'],
  });
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('---');
  next();
});

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Course API is running',
    status: 'healthy',
    dbConnected: isDbConnected,
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint for debugging
app.post('/test', (req: Request, res: Response) => {
  console.log('=== TEST ENDPOINT ===');
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  console.log('==================');
  
  res.json({
    success: true,
    received: req.body,
    headers: req.headers,
    message: 'Test endpoint received your request',
  });
});

// API Routes
app.use('/api/courses', courseRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error('Global Error Handler:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// MongoDB connection
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    isDbConnected = true;
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    isDbConnected = false;
    console.error('❌ MongoDB connection error:', err.message);
    
    if (exitOnDbError) {
      console.error('Exiting process due to database connection failure');
      process.exit(1);
    } else {
      console.warn('⚠️ Server continuing without MongoDB connection');
    }
  });

// Handle MongoDB disconnection
mongoose.connection.on('disconnected', () => {
  isDbConnected = false;
  console.warn('⚠️ MongoDB connection lost');
});

mongoose.connection.on('reconnected', () => {
  isDbConnected = true;
  console.log('✅ MongoDB connection restored');
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📚 Course API available at http://localhost:${port}/api/courses`);
  console.log(`🧪 Test endpoint: POST http://localhost:${port}/test`);
});