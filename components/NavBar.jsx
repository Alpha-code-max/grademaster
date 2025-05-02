'use client';

import { useState } from "react";
import Button from "./Button";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi"; // Add react-icons

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-100 shadow-md">
      <div className="container mx-auto flex flex-wrap justify-between items-center px-4 py-4 md:py-6">
        <div className="font-bold heading text-primary text-xl md:text-2xl">
          <Link href="/">GradeMaster<span className="text-accent">*</span></Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Navigation links and buttons */}
        <div className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } md:flex w-full md:w-auto flex-col md:flex-row items-center gap-4 md:gap-6 mt-4 md:mt-0`}>
          <ul className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-gray-700 font-medium">
            <li className="hover:text-blue-600 cursor-pointer"><Link href="/">Home</Link></li>
            <li className="hover:text-blue-600 cursor-pointer"><Link href="/About">About</Link></li>
            <li className="hover:text-blue-600 cursor-pointer"><Link href="/Contact">Contact</Link></li>
          </ul>

          <div className="flex gap-3">
            <Button className="w-full md:w-auto">
              <Link href="/auth/LoginPage">Login</Link>
            </Button>
            <Button className="w-full md:w-auto">
              <Link href="/auth/Register">Signup</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
