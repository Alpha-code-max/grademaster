'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import CourseInputRow from '@/components/CourseInputRow';
import Table from '@/components/Table';
import NavBar from '@/components/NavBar';
import { useCourseStore } from '@/store/courseStore';
import Link from 'next/link';
import { MdDelete, MdVisibility, MdSave, MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';

interface Course {
  _id?: string;
  courseName: string;
  credit: number;
  grade: string;
  level: string;
  semester: string;
}

interface SaveStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

interface StatisticCardProps {
  label: string;
  value: string | number;
  gradient?: string;
}

const StatisticCard = ({ label, value, gradient }: StatisticCardProps) => (
  <div
    className={`bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-gray-100 transition-all duration-300 shadow-sm ${
      gradient ? `bg-gradient-to-br ${gradient} shadow-md` : ''
    }`}
  >
    <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
    <p className={`text-3xl font-bold ${gradient ? 'text-white' : 'text-gray-900'}`}>{value}</p>
  </div>
);

const EmptyState = (): React.ReactElement => (
  <div className="text-center py-16">
    <div className="mb-6">
      <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
        <svg
          className="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m0 0h6m0-6h-6m0 0h-6m0 0V6m0 6v6"
          />
        </svg>
      </div>
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Yet</h3>
    <p className="text-gray-500 mb-6">Start by adding your first course to begin tracking your courses</p>
  </div>
);

const StatusMessage = ({ status }: { status: SaveStatus }) => {
  if (status.type === 'idle') return null;

  const baseClasses = 'mb-4 p-4 rounded-lg flex items-center gap-3 animate-in fade-in duration-200';
  const statusClasses = {
    success: 'bg-emerald-50 border border-emerald-300 text-emerald-800',
    error: 'bg-red-50 border border-red-300 text-red-800',
    loading: 'bg-blue-50 border border-blue-300 text-blue-800',
  };

  return (
    <div className={`${baseClasses} ${statusClasses[status.type]}`}>
      {status.type === 'success' && <MdCheckCircle className="w-5 h-5 flex-shrink-0" />}
      {status.type === 'error' && <MdErrorOutline className="w-5 h-5 flex-shrink-0" />}
      {status.type === 'loading' && <FiLoader className="w-5 h-5 flex-shrink-0 animate-spin" />}
      <span className="text-sm font-medium">{status.message}</span>
    </div>
  );
};

const ActionButton = ({
  onClick,
  disabled,
  icon: Icon,
  label,
  variant = 'secondary',
}: {
  onClick: () => void;
  disabled: boolean;
  icon: React.ComponentType<{ className: string }>;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}): React.ReactElement => {
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md',
    secondary: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300',
    danger: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-300',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg 
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 
        flex-1 sm:flex-none ${variantClasses[variant]}`}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

const CourseManagementPage = () => {
  const courses = useCourseStore((state) => state.courses);
  const loading = useCourseStore((state) => state.loading);
  const error = useCourseStore((state) => state.error);
  const fetchAllCourses = useCourseStore((state) => state.fetchAllCourses);
  const deleteCourse = useCourseStore((state) => state.deleteCourse);
  const clearError = useCourseStore((state) => state.clearError);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    type: 'idle',
    message: '',
  });

  const courseCount = useMemo(() => courses.length, [courses]);

  // Fetch courses on mount
  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  // Log courses when they change (for debugging)
  useEffect(() => {
    console.log('Courses updated:', courses);
  }, [courses]);

  // Handle store errors
  useEffect(() => {
    if (error) {
      setSaveStatus({
        type: 'error',
        message: error,
      });
      setTimeout(() => {
        setSaveStatus({ type: 'idle', message: '' });
        clearError();
      }, 3000);
    }
  }, [error, clearError]);

  const handleDeleteCourse = useCallback(
    async (id: string) => {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this course?')) {
        try {
          await deleteCourse(id);
          setSaveStatus({
            type: 'success',
            message: 'Course deleted successfully!',
          });
          setTimeout(() => {
            setSaveStatus({ type: 'idle', message: '' });
          }, 3000);
        } catch (err) {
          setSaveStatus({
            type: 'error',
            message: 'Failed to delete course',
          });
          setTimeout(() => {
            setSaveStatus({ type: 'idle', message: '' });
          }, 3000);
        }
      }
    },
    [deleteCourse]
  );

  const handleClearAll = useCallback((): void => {
    if (
      typeof window !== 'undefined' &&
      window.confirm('Are you sure you want to clear all courses? This action cannot be undone.')
    ) {
      // Delete each course individually
      courses.forEach((course) => {
        if (course._id) {
          deleteCourse(course._id);
        }
      });
      setSaveStatus({ type: 'idle', message: '' });
    }
  }, [courses, deleteCourse]);

  const isLoading = loading || saveStatus.type === 'loading';

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-40 md:pb-32">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
          {/* Header Section */}
          <header className="text-center space-y-3 sm:space-y-4">
            <div className="inline-block">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                Course Management
              </h1>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Track your courses with precision. Add courses and manage your academic portfolio.
            </p>
          </header>

          {/* Statistics Cards - Only show when courses exist */}
          {courseCount > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatisticCard label="Total Courses" value={courseCount} />
              <StatisticCard
                label="Courses"
                value={courseCount}
                gradient="from-blue-500 to-cyan-500"
              />
            </div>
          )}

          {/* Course Input Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Add New Course</h2>
            <div className="bg-white border border-gray-300 rounded-2xl p-6 hover:border-gray-400 transition-all duration-300 shadow-sm">
              <CourseInputRow />
            </div>
          </div>

          {/* Unfilled Fields Indicator */}
          <div className="bg-blue-50 border border-blue-300 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 9a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Required Fields</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <span className="font-medium">Course Title</span> - Give your course a name</li>
                  <li>• <span className="font-medium">Grade</span> - Enter your course grade</li>
                  <li>• <span className="font-medium">Credit Units</span> - Specify the number of units</li>
                  <li>• <span className="font-medium">GPA Scale</span> - Select your grading scale</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Courses Table Section */}
          {courseCount > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Courses</h2>
              <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm hover:border-gray-400 transition-all duration-300">
                <Table onDelete={handleDeleteCourse} />
              </div>
            </div>
          )}

          {/* Empty State */}
          {courseCount === 0 && !loading && <EmptyState />}
        </div>
      </main>

      {/* Floating Action Bar - Only show when courses exist */}
      {courseCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
            {/* Status Message */}
            <StatusMessage status={saveStatus} />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="hidden sm:flex items-baseline gap-3">
                <span className="text-gray-600 font-medium">Total Courses:</span>
                <span className="text-3xl font-bold text-blue-600">{courseCount}</span>
              </div>

              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <ActionButton
                  onClick={handleClearAll}
                  disabled={isLoading}
                  icon={MdDelete}
                  label="Clear All"
                  variant="danger"
                />

                <Link
                  href="/ViewCourses"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
                    bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300
                    rounded-lg transition-all duration-200 flex-1 sm:flex-none"
                >
                  <MdVisibility className="w-5 h-5" />
                  <span className="hidden sm:inline">View</span>
                </Link>

                <ActionButton
                  onClick={fetchAllCourses}
                  disabled={isLoading}
                  icon={isLoading ? FiLoader : MdSave}
                  label={isLoading ? 'Loading...' : 'Refresh'}
                  variant="primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagementPage;