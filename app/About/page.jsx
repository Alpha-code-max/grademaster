import NavBar from "@/components/NavBar";

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="bg-background mb-10">
        <NavBar />
      </div>
      <div className="min-h-screen bg-white px-6 py-20 text-gray-800">
        <div className="max-w-4xl mx-auto space-y-10">
          <h1 className="text-3xl font-bold text-primary">About GradeMaster</h1>

          <p className="text-lg leading-relaxed body">
            <span className="font-semibold">GradeMaster</span> is a comprehensive academic companion built to simplify the way students track their grades, calculate GPAs, and stay on top of their academic journey. Whether you're an undergraduate managing multiple semesters or a student planning your final CGPA, GradeMaster gives you the clarity and control you need.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-2">Why We Created GradeMaster</h2>
              <p className="body">
                Too often, students find themselves lost in spreadsheets or confused by GPA scales. GradeMaster was developed to eliminate that confusion. We wanted to create a simple, powerful tool that lets students focus more on learning and less on calculating.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-primary mb-2">Our Mission</h2>
              <p className="body">
                Our mission is to provide students with a smarter and more intuitive way to understand their academic performance. GradeMaster is built to support planning, reflection, and improvement by turning academic data into actionable insights.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">What GradeMaster Can Do</h2>
            <ul className="list-disc list-inside space-y-2 body">
              <li>Instant GPA and grade point calculation for every semester</li>
              <li>Smart tracking of course performance by level and term</li>
              <li>Clear visualization of academic progress and grade trends</li>
              <li>Responsive design — perfect on mobile, tablet, or desktop</li>
              <li>Save and edit course records with an easy-to-use interface</li>
              <li>Seamless onboarding — start tracking grades in seconds</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">Who GradeMaster Is For</h2>
            <p className="body">
              GradeMaster is designed for students at all levels who want more control and visibility over their academic outcomes. Whether you're just beginning university, in your final year, or returning to complete your degree — GradeMaster meets you where you are.
            </p>
          </div>

          <p className="text-center text-gray-500 tiny mt-16">
            &copy; {new Date().getFullYear()} GradeMaster. Built with ❤️ to help every student succeed.
          </p>
        </div>
      </div>
    </div>
  );
}
