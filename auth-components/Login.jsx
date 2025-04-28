'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavBar from "@/components/NavBar";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
    
      if (response.ok) {
        const data = await response.json();
        router.push('/'); // Redirect to home after successful login
      } else {
        const text = await response.text(); // <-- get text, not json
    
        let errorMessage = 'Login failed';
        try {
          const errorData = text ? JSON.parse(text) : null;
          errorMessage = errorData?.message || 'Login failed';
        } catch (parseError) {
          console.error('Failed to parse error JSON:', parseError);
          console.error('Raw server response:', text);
        }
    
        setError(errorMessage);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <form 
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-primary">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-primary 
                focus:border-transparent transition"
            />

            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-primary 
                focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-3 rounded-xl font-medium
              hover:bg-primary/90 transition duration-200 ease-in-out
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href="/auth/RegisterPage" 
              className="text-primary hover:text-primary/80 font-medium 
                hover:underline transition"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
