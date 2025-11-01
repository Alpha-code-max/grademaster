import mongoose, { Schema, Document, Model } from 'mongoose';

interface ICourse {
  courseName: string;
  credit: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  semester: string;
  level: '100' | '200' | '300' | '400' | '500' | '600';
}

interface ICgpaHistory {
  cgpa: number;
  timestamp: Date;
  semester?: string;
}

interface ICourseDocument extends Document {
  userId: mongoose.Types.ObjectId;
  courses: ICourse[];
  gradePoint: number;
  gpaScale: '4.0' | '5.0';
  cgpaHistory: ICgpaHistory[]; // Historical CGPA storage
  totalCredits: number; // Virtual
  totalGradePoints: number; // Virtual
}

const courseSchema: Schema<ICourseDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    courses: [
      {
        courseName: {
          type: String,
          required: [true, 'Course name is required'],
          trim: true,
          minlength: [2, 'Course name must be at least 2 characters'],
          maxlength: [100, 'Course name cannot exceed 100 characters'],
        },
        credit: {
          type: Number,
          required: [true, 'Credit hours are required'],
          min: [0, 'Credit hours cannot be negative'],
          max: [10, 'Credit hours cannot exceed 10'],
        },
        grade: {
          type: String,
          required: [true, 'Grade is required'],
          enum: {
            values: ['A', 'B', 'C', 'D', 'E', 'F'],
            message: '{VALUE} is not a valid grade',
          },
        },
        semester: {
          type: String,
          required: [true, 'Semester is required'],
          trim: true,
          match: [/^\d{4}\/\d{4}-[1-2]$/, 'Semester must be in format YYYY/YYYY-X (e.g., 2023/2024-1)'],
        },
        level: {
          type: String,
          required: [true, 'Level is required'],
          enum: {
            values: ['100', '200', '300', '400', '500', '600'],
            message: '{VALUE} is not a valid academic level',
          },
        },
      },
    ],
    gradePoint: {
  type: Number,
  default: 0,
  validate: {
    validator: function (this: ICourseDocument, value: number): boolean {
      if (this.gpaScale === '4.0') {
        return value >= 0 && value <= 4.0;
      } else if (this.gpaScale === '5.0') {
        return value >= 0 && value <= 5.0;
      }
      return true;
    },
    message: function (this: ICourseDocument): string {
      if (this.gpaScale === '4.0') {
        return 'GPA must be between 0 and 4.0';
      } else if (this.gpaScale === '5.0') {
        return 'GPA must be between 0 and 5.0';
      }
      return 'Invalid GPA scale';
    },
  },
},
    gpaScale: {
      type: String,
      enum: {
        values: ['4.0', '5.0'],
        message: '{VALUE} is not a valid GPA scale. Choose 4.0 or 5.0',
      },
      required: [true, 'GPA scale is required'],
      default: '4.0',
    },
    cgpaHistory: [
      {
        cgpa: {
          type: Number,
          required: true,
          validate: {
            validator: function (this: ICgpaHistory, value: number): boolean {
              const course = this as any as ICourseDocument;
              if (course.gpaScale === '4.0') {
                return value >= 0 && value <= 4.0;
              } else if (course.gpaScale === '5.0') {
                return value >= 0 && value <= 5.0;
              }
              return true;
            },
            message: 'CGPA must match the GPA scale',
          },
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        semester: {
          type: String,
          match: [/^\d{4}\/\d{4}-[1-2]$/, 'Semester must be in format YYYY/YYYY-X'],
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Grade point mappings
const gradePoints: { [key: string]: { '4.0': number; '5.0': number } } = {
  A: { '4.0': 4.0, '5.0': 5.0 },
  B: { '4.0': 3.0, '5.0': 4.0 },
  C: { '4.0': 2.0, '5.0': 3.0 },
  D: { '4.0': 1.0, '5.0': 2.0 },
  E: { '4.0': 0.0, '5.0': 1.0 },
  F: { '4.0': 0.0, '5.0': 0.0 },
};

// Virtual for total credits (sum of credit hours)
courseSchema.virtual('totalCredits').get(function (this: ICourseDocument): number {
  return this.courses.reduce((total, course) => total + course.credit, 0);
});

// Virtual for total grade points (sum of credit * grade point)
courseSchema.virtual('totalGradePoints').get(function (this: ICourseDocument): number {
  return this.courses.reduce((total, course) => {
    const gradePoint = gradePoints[course.grade][this.gpaScale] || 0;
    return total + course.credit * gradePoint;
  }, 0);
});

// Pre-save hook to calculate and store gradePoint, update cgpaHistory
courseSchema.pre('save', function (this: ICourseDocument, next) {
  const totalCredits = this.totalCredits;
  const totalGradePoints = this.totalGradePoints;
  const newGpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  // Only update gradePoint and cgpaHistory if courses or gpaScale changed
  if (this.isModified('courses') || this.isModified('gpaScale')) {
    this.gradePoint = newGpa;
    this.cgpaHistory.push({
      cgpa: newGpa,
      timestamp: new Date(),
      semester: this.courses.length > 0 ? this.courses[this.courses.length - 1].semester : undefined,
    });
  }

  next();
});

// Define and export model
const Course: Model<ICourseDocument> = mongoose.models.Course || mongoose.model<ICourseDocument>('Course', courseSchema);

// Export getCourseModel if needed
export async function getCourseModel(): Promise<Model<ICourseDocument>> {
  return Course;
}

export default Course;
export { ICourse, ICourseDocument };