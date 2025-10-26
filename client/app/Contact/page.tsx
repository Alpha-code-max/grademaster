'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import { MdSend, MdPerson, MdEmail, MdMessage, MdCheckCircle, MdError } from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<FormStatus>({
    type: null,
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Please enter your name' });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return false;
    }

    if (!formData.subject.trim()) {
      setStatus({ type: 'error', message: 'Please enter a subject' });
      return false;
    }

    if (!formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please enter your message' });
      return false;
    }

    if (formData.message.length < 10) {
      setStatus({ type: 'error', message: 'Message must be at least 10 characters long' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        setStatus({
          type: 'error',
          message: data.message || 'Failed to send message. Please try again.'
        });
        setLoading(false);
        return;
      }

      setStatus({
        type: 'success',
        message: 'Message sent successfully! We\'ll get back to you soon.'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 5000);
    } catch (error) {
      console.error('[CONTACT_ERROR]', error);
      setStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <NavBar />

      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300">
                Get in Touch
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Have questions, feedback, or need support? We're here to help make your experience better.
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-xl">
              <div className="text-blue-400 text-4xl mb-3 flex justify-center">
                📧
              </div>
              <h3 className="text-white font-semibold mb-1">Email</h3>
              <p className="text-gray-400 text-sm">support@example.com</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-xl">
              <div className="text-blue-400 text-4xl mb-3 flex justify-center">
                📞
              </div>
              <h3 className="text-white font-semibold mb-1">Phone</h3>
              <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center backdrop-blur-xl">
              <div className="text-blue-400 text-4xl mb-3 flex justify-center">
                ⏰
              </div>
              <h3 className="text-white font-semibold mb-1">Hours</h3>
              <p className="text-gray-400 text-sm">Mon - Fri, 9AM - 5PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl shadow-blue-600/20 border border-white/20 space-y-6"
          >
            {/* Status Messages */}
            {status.type && (
              <div
                className={`p-4 rounded-xl border flex items-center gap-3 transition-all duration-200 ${
                  status.type === 'success'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {status.type === 'success' ? (
                  <MdCheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <MdError className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">{status.message}</span>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-white font-semibold mb-3">
                <MdPerson className="text-blue-400" size={20} />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                  text-white placeholder-gray-500 focus:outline-none focus:ring-2
                  focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-white font-semibold mb-3">
                <MdEmail className="text-blue-400" size={20} />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                  text-white placeholder-gray-500 focus:outline-none focus:ring-2
                  focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="flex items-center gap-2 text-white font-semibold mb-3">
                <MdMessage className="text-blue-400" size={20} />
                Subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                  text-white placeholder-gray-500 focus:outline-none focus:ring-2
                  focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="flex items-center gap-2 text-white font-semibold mb-3">
                <MdMessage className="text-blue-400" size={20} />
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here... (minimum 10 characters)"
                rows={5}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                  text-white placeholder-gray-500 focus:outline-none focus:ring-2
                  focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200
                  resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">
                {formData.message.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                text-white font-semibold px-8 py-4 rounded-xl active:scale-[0.98] transition-all duration-200
                disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-blue-600/20
                hover:shadow-xl hover:shadow-blue-600/40"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <MdSend size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

            {/* Additional Info */}
            <p className="text-center text-xs text-gray-500">
              We typically respond within 24-48 hours. Thank you for reaching out!
            </p>
          </form>

          {/* Footer */}
          <footer className="text-center pt-12 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} GradeMaster. Made with
              <span className="mx-1 text-red-500">❤️</span>
              for students
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;