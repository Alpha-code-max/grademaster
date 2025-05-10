'use client';

import { useState, useEffect } from "react";
import Button from "./Button";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex justify-between items-center px-4 lg:px-8 py-4">
        {/* Logo */}
        <div className="relative z-50">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GradeMaster
            </span>
            <span className="text-accent text-2xl animate-pulse">*</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden relative z-50 p-2 rounded-full hover:bg-gray-100/50 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX size={24} className="text-primary" /> : <HiMenu size={24} className="text-primary" />}
        </button>

        {/* Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Navigation links and buttons */}
        <div className={`fixed top-0 right-0 h-full w-[280px] md:w-auto md:static bg-white md:bg-transparent p-6 md:p-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        } md:flex md:flex-row md:items-center md:gap-8`}>
          <ul className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 text-gray-600 font-medium mt-16 md:mt-0">
            {['Home', 'About', 'Contact'].map((item) => (
              <li key={item} className="w-full md:w-auto">
                <Link 
                  href={item === 'Home' ? '/' : `/${item}`}
                  className="relative block py-2 md:py-0 hover:text-primary transition-colors duration-300 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col md:flex-row gap-4 mt-8 md:mt-0">
            <Button className="w-full md:w-auto px-6 py-2 text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors duration-300">
              <Link href="/auth/LoginPage" onClick={() => setIsMenuOpen(false)}>Login</Link>
            </Button>
            <Button className="w-full md:w-auto px-6 py-2 bg-primary text-white hover:bg-primary/90 transition-colors duration-300">
              <Link href="/auth/Register" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
