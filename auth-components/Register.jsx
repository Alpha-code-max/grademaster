'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <form 
          className="bg-white p-8 rounded-2xl shadow-lg space-y-6" 
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-center text-primary mb-8">
            Create an Account
          </h2>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="w-full px-4 py-3 border border-gray-300 text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-4 py-3 border text-text border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              minLength={6}
              className="w-full px-4 py-3 border text-text border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-3 rounded-xl font-medium
              hover:bg-primary/90 transition duration-200 ease-in-out
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/auth/LoginPage" 
              className="text-primary hover:text-primary/80 font-medium hover:underline transition"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
