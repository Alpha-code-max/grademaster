"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseModel = getCourseModel;
const mongoose_1 = __importStar(require("mongoose"));
const courseSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            validator: function (value) {
                if (this.gpaScale === '4.0') {
                    return value >= 0 && value <= 4.0;
                }
                else if (this.gpaScale === '5.0') {
                    return value >= 0 && value <= 5.0;
                }
                return true;
            },
            message: function () {
                if (this.gpaScale === '4.0') {
                    return 'GPA must be between 0 and 4.0';
                }
                else if (this.gpaScale === '5.0') {
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
                    validator: function (value) {
                        const course = this;
                        if (course.gpaScale === '4.0') {
                            return value >= 0 && value <= 4.0;
                        }
                        else if (course.gpaScale === '5.0') {
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Grade point mappings
const gradePoints = {
    A: { '4.0': 4.0, '5.0': 5.0 },
    B: { '4.0': 3.0, '5.0': 4.0 },
    C: { '4.0': 2.0, '5.0': 3.0 },
    D: { '4.0': 1.0, '5.0': 2.0 },
    E: { '4.0': 0.0, '5.0': 1.0 },
    F: { '4.0': 0.0, '5.0': 0.0 },
};
// Virtual for total credits (sum of credit hours)
courseSchema.virtual('totalCredits').get(function () {
    return this.courses.reduce((total, course) => total + course.credit, 0);
});
// Virtual for total grade points (sum of credit * grade point)
courseSchema.virtual('totalGradePoints').get(function () {
    return this.courses.reduce((total, course) => {
        const gradePoint = gradePoints[course.grade][this.gpaScale] || 0;
        return total + course.credit * gradePoint;
    }, 0);
});
// Pre-save hook to calculate and store gradePoint, update cgpaHistory
courseSchema.pre('save', function (next) {
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
const Course = mongoose_1.default.models.Course || mongoose_1.default.model('Course', courseSchema);
// Export getCourseModel if needed
async function getCourseModel() {
    return Course;
}
exports.default = Course;
//# sourceMappingURL=course.js.map