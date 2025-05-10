'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import NavBar from '@/components/NavBar';

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/auth/LoginPage');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <NavBar />
      
      <div className="flex items-center justify-center p-4 sm:p-8 mt-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Create Account
            </h1>
            <p className="text-gray-600 mt-2">
              Join us and start managing your academic journey
            </p>
          </div>

          <form 
            className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl shadow-gray-200/50 space-y-6" 
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <FiUser />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200 bg-white/50"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <FiMail />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200 bg-white/50"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <FiLock />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200 bg-white/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl 
                font-medium hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] 
                transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''} group`}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? 'Creating Account...' : 'Create Account'}
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/auth/LoginPage" 
                className="text-primary hover:text-accent font-medium transition-colors"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
