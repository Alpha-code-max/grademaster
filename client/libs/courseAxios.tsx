import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** ─────────────────────────────────────────────
 *  Types
 *  ───────────────────────────────────────────── */
export interface ICourse {
  courseName: string;
  credit: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  semester: string;
  level: '100' | '200' | '300' | '400' | '500' | '600';
}

export interface ICgpaHistory {
  cgpa: number;
  timestamp: string; // serialized Date
  semester?: string;
}

export interface ICourseDocumentLean {
  _id: string;
  userId: string;
  courses: ICourse[];
  gradePoint: number;
  gpaScale: '4.0' | '5.0';
  cgpaHistory: ICgpaHistory[];
  totalCredits: number;
  totalGradePoints: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** ─────────────────────────────────────────────
 *  Course Service
 *  ───────────────────────────────────────────── */
class CourseService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/courses`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        console.log(`[${new Date().toISOString()}] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        if (status === 401) {
          console.warn('⚠️ 401 Unauthorized - Redirecting to login');
          localStorage.removeItem('authToken');
          window.location.href = '/auth/LoginPage';
        }
        return Promise.reject(error);
      }
    );
  }

  /** Create a new course */
  async createCourse(payload: {
    courses: ICourse[];
    gpaScale: '4.0' | '5.0';
  }): Promise<ICourseDocumentLean> {
    const response = await this.api.post<ApiResponse<ICourseDocumentLean>>('/', payload);
    return response.data.data || response.data;
  }

  /** Get all courses */
  async getAllCourses(): Promise<ICourseDocumentLean[]> {
    const response = await this.api.get<ApiResponse<ICourseDocumentLean[]>>('/');
    return response.data.data || response.data;
  }

  /** Get course by ID */
  async getCourseById(id: string): Promise<ICourseDocumentLean> {
    const response = await this.api.get<ApiResponse<ICourseDocumentLean>>(`/${id}`);
    return response.data.data || response.data;
  }

  /** Update a course */
  async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourseDocumentLean> {
    const response = await this.api.put<ApiResponse<ICourseDocumentLean>>(`/${id}`, data);
    return response.data.data || response.data;
  }

  /** Delete a course */
  async deleteCourse(id: string): Promise<void> {
    await this.api.delete(`/${id}`);
  }
}

const courseService = new CourseService();
export default courseService;
