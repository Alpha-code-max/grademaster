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

    if (!validateForm()) return;

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
        message: 'Message sent successfully! We&apos;ll get back to you soon.'
      });

      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setStatus({ type: null, message: '' }), 5000);
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
    <div className="min-h-screen relative bg-white overflow-hidden">
      {/* Diagonal motif */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(240,240,240,1)_0px,rgba(240,240,240,1)_2px,rgba(255,255,255,1)_2px,rgba(255,255,255,1)_20-px)] z-0"></div>

      <div className="relative z-10">
        <NavBar />

        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
                Get in Touch
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                Have questions, feedback, or need support? We&apos;re here to help make your experience better.
              </p>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: '📧', title: 'Email', text: 'support@example.com' },
                { icon: '📞', title: 'Phone', text: '+1 (555) 123-4567' },
                { icon: '⏰', title: 'Hours', text: 'Mon - Fri, 9AM - 5PM' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition"
                >
                  <div className="text-blue-500 text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-lg space-y-6"
            >
              {/* Status */}
              {status.type && (
                <div
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all duration-200 ${
                    status.type === 'success'
                      ? 'bg-green-50 border-green-300 text-green-600'
                      : 'bg-red-50 border-red-300 text-red-600'
                  }`}
                >
                  {status.type === 'success' ? (
                    <MdCheckCircle className="w-5 h-5" />
                  ) : (
                    <MdError className="w-5 h-5" />
                  )}
                  <span className="text-sm">{status.message}</span>
                </div>
              )}

              {/* Inputs */}
              {[
                { id: 'name', label: 'Full Name', icon: <MdPerson />, type: 'text', placeholder: 'John Doe' },
                { id: 'email', label: 'Email Address', icon: <MdEmail />, type: 'email', placeholder: 'john@example.com' },
                { id: 'subject', label: 'Subject', icon: <MdMessage />, type: 'text', placeholder: 'What is this about?' },
              ].map((f, i) => (
                <div key={i}>
                  <label htmlFor={f.id} className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                    <span className="text-blue-500">{f.icon}</span>
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    type={f.type}
                    name={f.id}
                    value={(formData as any)[f.id]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 disabled:opacity-50"
                  />
                </div>
              ))}

              {/* Message */}
              <div>
                <label htmlFor="message" className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                  <MdMessage className="text-blue-500" />
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 resize-none disabled:opacity-50"
                />
                <p className="text-xs text-gray-400 mt-2">
                  {formData.message.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl active:scale-[0.98] transition-all duration-200 disabled:opacity-70"
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
                      <MdSend size={20} />
                    </>
                  )}
                </span>
              </button>

              <p className="text-center text-xs text-gray-500">
                We typically respond within 24-48 hours. Thank you for reaching out!
              </p>
            </form>

            <footer className="text-center pt-12 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} GradeMaster. Made with
                <span className="mx-1 text-red-500">❤️</span> for students
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
