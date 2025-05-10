'use client'

import { useState } from 'react'
import NavBar from "@/components/NavBar"
import { MdSend, MdPerson, MdEmail, MdMessage } from "react-icons/md"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add form submission logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />
      
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Get in Touch
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Have questions or feedback? We're here to help make your academic journey better.
            </p>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100"
          >
            <div className="space-y-6">
              <div className="relative">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <MdPerson className="text-primary" size={20} />
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div className="relative">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <MdEmail className="text-primary" size={20} />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div className="relative">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <MdMessage className="text-primary" size={20} />
                  Message
                </label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  Send Message
                  <MdSend size={20} />
                </span>
              </button>
            </div>
          </form>

          <footer className="text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} GradeMaster. Made with 
              <span className="mx-1 text-red-500">❤️</span> 
              for students
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
