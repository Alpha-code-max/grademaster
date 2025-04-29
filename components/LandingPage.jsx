import Link from 'next/link'; // Default import for Next.js


export default function LandingPage() {
    return (
      <div className="min-h-screen bg-background p-6 pt-32 container mx-auto">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto py-20">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-8">
            <p>GradeMaster:</p> 
            <p>Your Ultimate Grade <span className='shadow-accent shadow-lg p-0.5 rounded-3xl mt-2 text-accent'>Calculator</span></p>
          </h1>
          <p className="text-text md:text-xl body mb-8">
            Say goodbye to manual calculations. GradeMaster makes it effortless to track grades, calculate grade points, and stay on top of academic performance.
          </p>
          <button className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-2xl font-semibold shadow-md transition">
            <Link href='/CoursePage'>
              Get Started
            </Link>
          </button>
        </section>
  
        {/* Features Section */}
        <section className="bg-white py-16 px-4 rounded-3xl shadow-xl max-w-6xl mx-auto">
          <h2 className="heading text-center text-gray-800 mb-12">
            What You Can Do with GradeMaster
          </h2>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-blue-100 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-2">Automatic Grade Calculation</h3>
              <p className="text-gray-700">Input your course data and let GradeMaster compute your GPA and grade points in real-time.</p>
            </div>
  
            <div className="bg-blue-100 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-2">Organized Semester Tracking</h3>
              <p className="text-gray-700">Sort and view courses by semester and academic level with ease.</p>
            </div>
  
            <div className="bg-blue-100 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-2">Customizable Inputs</h3>
              <p className="text-gray-700">Add and modify courses, credits, and grades according to your academic structure.</p>
            </div>
          </div>
        </section>
  
        {/* Footer */}
        {/* <footer className="text-center text-gray-500 mt-20 text-sm">
          &copy; {new Date().getFullYear()} GradeMaster. All rights reserved.
        </footer> */}
      </div>
    );
  }
  