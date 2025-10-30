"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "./Button";
import {
  HiMenu,
  HiX,
  HiHome,
  HiInformationCircle,
  HiPhone,
  HiBookOpen,
} from "react-icons/hi";
import useAuthStore from "@/store/userStore";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GradeMaster
            </span>
            <span className="text-accent text-2xl animate-pulse">*</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-10 text-gray-700 font-medium tracking-wide">
          {["Home", "About", "Contact", "Guide", "CoursePage"].map((item) => (
            <li key={item}>
              <Link
                href={item === "Home" ? "/" : `/${item}`}
                className="relative hover:text-primary transition-colors duration-300 group"
              >
                {item}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm md:text-base">
                {user?.name || "User"} 👋
              </span>
              <Button
                onClick={logout}
                className="px-5 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 rounded-full"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button className="px-5 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 rounded-full">
                <Link href="/auth/LoginPage">Login</Link>
              </Button>
              <Button className="px-5 py-2 bg-primary text-white hover:bg-primary/90 transition-colors duration-300 rounded-full">
                <Link href="/auth/Register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Dropdown Menu */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white shadow-lg border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden flex flex-col p-6`}
      >
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="text-2xl font-bold text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            GradeMaster
          </Link>
          <HiX
            size={26}
            className="cursor-pointer text-primary"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>

        {/* ✅ FIXED UL SYNTAX HERE */}
        <ul
  className={`flex flex-col gap-6 text-gray-700 font-medium transition-all duration-300 mb-8 ${
    isMenuOpen ? "bg-white p-4 rounded-lg shadow-sm" : ""
  }`}
>
  {[
    { name: "Home", icon: <HiHome />, href: "/" },
    { name: "About", icon: <HiInformationCircle />, href: "/About" },
    { name: "Contact", icon: <HiPhone />, href: "/Contact" },
    { name: "Guide", icon: <HiBookOpen />, href: "/Guide" },
    {name: "CoursePage", icon: <HiBookOpen />, href: "/CoursePage" },
  ].map(({ name, icon, href }) => (
    <li key={name}>
      <Link
        href={href}
        onClick={() => setIsMenuOpen(false)}
        className="hover:text-primary transition-colors flex items-center gap-2"
      >
        {icon}
        {name}
      </Link>
    </li>
  ))}
</ul>

        {/* Mobile Auth Buttons */}
        {/* Mobile Auth Buttons */}
<div
  className={`mt-auto flex flex-col gap-4 p-4 rounded-lg transition-all duration-300 ${
    isMenuOpen ? "bg-white shadow-sm" : ""
  }`}
>
  {isAuthenticated ? (
    <>
      <span className="bg-primary/10 text-primary font-semibold px-3 py-2 rounded-full text-center">
        {user?.name || "User"} 👋
      </span>
      <Button
        onClick={() => {
          logout();
          setIsMenuOpen(false);
        }}
        className="w-full bg-red-500 text-white hover:bg-red-600 rounded-full"
      >
        Logout
      </Button>
    </>
  ) : (
    <>
      <Button className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full">
        <Link
          href="/auth/LoginPage"
          onClick={() => setIsMenuOpen(false)}
        >
          Login
        </Link>
      </Button>
      <Button className="w-full bg-primary text-white hover:bg-primary/90 rounded-full">
        <Link
          href="/auth/Register"
          onClick={() => setIsMenuOpen(false)}
        >
          Sign Up
        </Link>
      </Button>
    </>
  )}
</div>
      </div>
    </nav>
  );
}
