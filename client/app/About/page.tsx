import NavBar from "@/components/NavBar";
import { MdSchool, MdAssignment, MdPeople, MdTimeline } from "react-icons/md";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16">
        <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
          <header className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                About GradeMaster
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive academic companion built to simplify grade tracking and GPA calculations
            </p>
          </header>

          <section className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-900">GradeMaster</span> is designed to simplify the way students track their grades, calculate GPAs, and stay on top of their academic journey. Whether you're managing multiple semesters or planning your final CGPA, we provide the clarity and control you need.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MdSchool className="text-primary" size={24} />
                Why We Created GradeMaster
              </h2>
              <p className="text-gray-600">
                Too often, students find themselves lost in spreadsheets or confused by GPA scales. We developed GradeMaster to eliminate that confusion and let students focus more on learning.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MdTimeline className="text-primary" size={24} />
                Our Mission
              </h2>
              <p className="text-gray-600">
                Our mission is to provide students with a smarter and more intuitive way to understand their academic performance, turning data into actionable insights.
              </p>
            </div>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MdAssignment className="text-primary" size={24} />
              What GradeMaster Can Do
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  </span>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MdPeople className="text-primary" size={24} />
              Who GradeMaster Is For
            </h2>
            <p className="text-gray-600">
              GradeMaster is designed for students at all levels who want more control and visibility over their academic outcomes. Whether you&apos;re just beginning university or in your final year — GradeMaster meets you where you are.
            </p>
          </section>

          <footer className="text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} GradeMaster. Built with 
              <span className="mx-1 text-red-500">❤️</span> 
              for students
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

const features = [
  "Instant GPA and grade point calculation",
  "Smart tracking of course performance",
  "Clear visualization of academic progress",
  "Responsive design for all devices",
  "Easy-to-use course management",
  "Seamless onboarding experience"
];
