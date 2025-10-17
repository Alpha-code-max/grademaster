import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
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

// Middleware to parse JSON and URL-encoded bodies

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Logging middleware (MUST come after body parsers)
app.use((req: Request, res: Response, next: express.NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
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

// Test endpoint
app.post('/test', (req: Request, res: Response) => {
  console.log('Test endpoint - req.body:', req.body);
  console.log('Test endpoint - req.headers:', req.headers);
  res.json({ success: true, body: req.body });
});

// API Routes (with optional DB connection check)
app.use('/api/courses', courseRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
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
});