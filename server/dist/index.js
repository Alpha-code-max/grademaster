"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
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
app.use((0, cors_1.default)(corsOptions));
// 2. Body parsers
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// 3. Logging middleware (after parsers, before routes)
app.use((req, res, next) => {
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
app.get('/', (req, res) => {
    res.json({
        message: 'Course API is running',
        status: 'healthy',
        dbConnected: isDbConnected,
        timestamp: new Date().toISOString(),
    });
});
// Test endpoint for debugging
app.post('/test', (req, res) => {
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
app.use('/api/courses', courseRoutes_1.default);
app.use('/api/users', usersRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.path,
        method: req.method,
    });
});
// Global error handler
app.use((err, req, res, next) => {
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
mongoose_1.default.connect(mongoUri, {
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
    }
    else {
        console.warn('⚠️ Server continuing without MongoDB connection');
    }
});
// Handle MongoDB disconnection
mongoose_1.default.connection.on('disconnected', () => {
    isDbConnected = false;
    console.warn('⚠️ MongoDB connection lost');
});
mongoose_1.default.connection.on('reconnected', () => {
    isDbConnected = true;
    console.log('✅ MongoDB connection restored');
});
// Start the server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📚 Course API available at http://localhost:${port}/api/courses`);
    console.log(`🧪 Test endpoint: POST http://localhost:${port}/test`);
});
//# sourceMappingURL=index.js.map