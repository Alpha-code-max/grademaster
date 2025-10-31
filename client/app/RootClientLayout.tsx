'use client';

import { useEffect } from 'react';
import { Poppins, Fira_Code } from 'next/font/google';
import useAuthStore from '@/store/userStore';
import { useRouter } from 'next/navigation';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const firaCode = Fira_Code({
  variable: '--font-fira',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  // Initialize auth immediately on client
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Redirect if unauthenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/auth/LoginPage');
    }
  }, [isAuthenticated, router]);

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${firaCode.variable} font-sans bg-gray-50 text-gray-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
