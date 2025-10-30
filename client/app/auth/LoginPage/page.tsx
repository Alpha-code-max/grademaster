'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import authService from '@/libs/authAxios';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }

      // 🔐 Attempt login
      const res = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      console.log("✅ Login response:", res?.data);

      // ✅ Save userId from response to localStorage
      const userId =
        res?.data?.user?._id  || null;

      if (!userId) {
        throw new Error("Unable to retrieve user ID from server response.");
      }

      localStorage.setItem('userId', userId);
      console.log("🧠 Saved userId:", userId);

      setSuccess('Login successful! Redirecting...');
      setLoading(false);

      // Redirect to course page
      setTimeout(() => {
        router.replace('/CoursePage');
      }, 15000);

    } catch (err: any) {
      console.error('[LOGIN_ERROR]', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <div className="flex items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-80px)] mt-11">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Enter your credentials to continue</p>
          </div>

          {/* Form Container */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-gray-200 p-8 rounded-2xl shadow-lg space-y-6"
          >
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-xl text-sm flex items-center gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                    text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                    text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700 hover:text-gray-900 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-2 border-gray-300" />
                Remember me
              </label>
              <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                text-white py-3 rounded-xl font-semibold group active:scale-[0.98]
                transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? 'Logging in...' : 'Login'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-700">
              Don't have an account?{' '}
              <Link href="/auth/Register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
