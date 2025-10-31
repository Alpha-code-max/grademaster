'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CourseInputRow from "@/components/CourseInputRow";
import NavBar from "@/components/NavBar";
import useAuthStore from "@/store/userStore";

const CoursePage = () => {
  const router = useRouter();
  const { user, token, isAuthenticated, initializeAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Initialize auth and mark mounted
  useEffect(() => {
    initializeAuth();
    setMounted(true);
  }, [initializeAuth]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/auth/LoginPage");
    }
  }, [mounted, isAuthenticated, router]);

  // Optionally, render nothing until mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div>
      <div className="container mb-32 px-4">
        <NavBar />
      </div>
      <CourseInputRow />
    </div>
  );
};

export default CoursePage;
