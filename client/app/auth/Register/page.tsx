'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import authService from '@/libs/authAxios';
import { User, AlertCircle, CheckCircle, Lock, Mail, Phone, ArrowRight } from 'lucide-react';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

interface PasswordStrengthResult {
  score: number;
  feedback: string;
  color: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthResult>({
    score: 0,
    feedback: '',
    color: 'gray',
  });

  const evaluatePasswordStrength = (password: string): PasswordStrengthResult => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    const colors = ['gray', 'red', 'orange', 'yellow', 'lime', 'green'];
    const feedbacks = [
      'Too weak',
      'Weak',
      'Fair',
      'Good',
      'Strong',
      'Very Strong'
    ];

    return {
      score,
      feedback: feedbacks[score],
      color: colors[score],
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(evaluatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (passwordStrength.score < 2) {
        setError('Password is too weak. Please use a stronger password.');
        setLoading(false);
        return;
      }

      // Call auth service
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone || undefined,
      });

      setSuccess('Account created successfully! Redirecting...');
      setLoading(false);
      
      setTimeout(() => router.replace('/CoursePage'), 2000);
    } catch (err: any) {
      console.error('[REGISTER_ERROR]', err);
      const errorMessage = err?.message || err?.response?.data?.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const strengthColors: Record<string, string> = {
    gray: 'bg-gray-300',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    lime: 'bg-lime-500',
    green: 'bg-green-500',
  };

  const strengthTextColors: Record<string, string> = {
    gray: 'text-gray-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    yellow: 'text-yellow-600',
    lime: 'text-lime-600',
    green: 'text-green-600',
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <div className="flex items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Us</h1>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {/* Form Container */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-gray-200 p-8 rounded-2xl shadow-lg space-y-5"
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

            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                    text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

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

            {/* Phone Input */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-800">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
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
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthColors[passwordStrength.color]} transition-all`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${strengthTextColors[passwordStrength.color]}`}>
                      {passwordStrength.feedback}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Use uppercase, lowercase, numbers, and symbols for a stronger password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl
                    text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    focus:border-blue-500 transition-all duration-200"
                />
              </div>
              {formData.confirmPassword && (
                <p className={`text-xs font-medium ${
                  formData.password === formData.confirmPassword
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {formData.password === formData.confirmPassword
                    ? '✓ Passwords match'
                    : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-2 border-gray-300" required />
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Service
              </Link>
            </label>

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
                {loading ? 'Creating Account...' : 'Sign Up'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-700">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}