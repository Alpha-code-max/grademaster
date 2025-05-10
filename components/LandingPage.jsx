import Link from 'next/link';
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../app/api/auth/[...nextauth]/route"
import { FaCalculator, FaChartLine, FaCog } from 'react-icons/fa'

export default async function LandingPage() {
  const session = await getServerSession(authOptions)
  if(!session) redirect("/auth/LoginPage")
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl -z-10" />
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                GradeMaster
              </span>
              <p className="mt-4 text-3xl md:text-5xl text-gray-900">
                Your Ultimate Grade 
                <span className="relative inline-block px-4">
                  Calculator
                  <div className="absolute inset-x-0 bottom-0 h-3 bg-accent/20 -z-10 transform skew-x-12" />
                </span>
              </p>
            </h1>
            
            <p className="mt-8 text-lg sm:text-xl text-gray-600 leading-relaxed">
              Say goodbye to manual calculations. GradeMaster makes it effortless to track grades, 
              calculate grade points, and stay on top of academic performance.
            </p>
            
            <div className="mt-10">
              <Link 
                href="/CoursePage"
                className="group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105"
              >
                Get Started
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            What You Can Do with GradeMaster
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-accent/5 rounded-bl-[100px] -z-10" />
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const features = [
  {
    icon: <FaCalculator size={24} />,
    title: "Automatic Grade Calculation",
    description: "Input your course data and let GradeMaster compute your GPA and grade points in real-time."
  },
  {
    icon: <FaChartLine size={24} />,
    title: "Organized Semester Tracking",
    description: "Sort and view courses by semester and academic level with ease."
  },
  {
    icon: <FaCog size={24} />,
    title: "Customizable Inputs",
    description: "Add and modify courses, credits, and grades according to your academic structure."
  }
];
