import NavBar from "@/components/NavBar";

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-background mb-6 md:mb-10">
        <NavBar />
      </div>
      
      <div className="px-4 md:px-6 lg:px-8 py-10 md:py-20 text-gray-800">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary text-center">
            Contact Us
          </h1>

          <p className="body text-center text-sm md:text-base px-4">
            Have questions, feedback, or need help with GradeMaster? We're here to assist you. 
            Reach out using the form below and we'll get back to you as soon as possible.
          </p>

          <form className="space-y-4 md:space-y-6 bg-gray-50 p-4 md:p-6 rounded-xl shadow-md">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                className="mt-1 w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Write your message here..."
                className="mt-1 w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-primary text-white font-semibold px-4 md:px-6 py-2 text-sm md:text-base rounded-md hover:bg-primary/80 transition duration-200"
            >
              Send Message
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs md:text-sm mt-8 md:mt-16">
            &copy; {new Date().getFullYear()} GradeMaster. Built with ❤️ to help every student succeed.
          </p>
        </div>
      </div>
    </div>
  );
}
