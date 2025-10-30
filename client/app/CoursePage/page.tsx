"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseInputRow from "@/components/CourseInputRow";
import NavBar from "@/components/NavBar";
import useAuthStore from "@/store/userStore";

const CoursePage = () => {
  const router = useRouter();
  const { user, token, isAuthenticated, initializeAuth } = useAuthStore();

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/LoginPage");
    }
  }, [isAuthenticated, router]);

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
