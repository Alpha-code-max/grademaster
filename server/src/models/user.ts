import mongoose, { Schema, Document, Model } from 'mongoose';

// Direct mongoose connection (replace with your actual connection string)
const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grademaster');
  }
};

// Interface for User document with all required fields
export interface IUserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  role: 'user' | 'admin' | 'moderator';
  isVerified: boolean;
  isActive: boolean;
  avatar?: string | null;
  bio?: string | null;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// User schema with validations
const userSchema: Schema<IUserDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password by default in queries
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better query performance
// Note: email index is automatically created by unique: true, so we don't add it here
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Function to get or create the User model
const getUserModel = async (): Promise<Model<IUserDocument>> => {
  try {
    await connect();
    return mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);
  } catch (error: any) {
    console.error('Error creating User model:', error);
    throw new Error(`Failed to create User model: ${error.message}`);
  }
};

export default getUserModel;