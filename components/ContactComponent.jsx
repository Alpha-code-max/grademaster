import NavBar from "@/components/NavBar";

export default function ContactPage() {
  return (
    <div className="bg-background">
      <div className="bg-background mb-10">
        <NavBar />
      </div>
      <div className="min-h-screen bg-white px-6 py-20 text-gray-800">
        <div className="max-w-3xl mx-auto space-y-10">
          <h1 className="text-4xl font-bold text-primary text-center">Contact Us</h1>

          <p className="body text-center">
            Have questions, feedback, or need help with GradeMaster? We're here to assist you. Reach out using the form below and we'll get back to you as soon as possible.
          </p>

          <form className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-md">
            <div>
              <label className="block small font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Your full name"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block small font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block small font-medium text-gray-700">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message here..."
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-primary text-white font-semibold px-6 py-2 rounded-md hover:bg-primary-dark transition duration-200"
            >
              Send Message
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-16">
            &copy; {new Date().getFullYear()} GradeMaster. Built with ❤️ to help every student succeed.
          </p>
        </div>
      </div>
    </div>
  );
}
