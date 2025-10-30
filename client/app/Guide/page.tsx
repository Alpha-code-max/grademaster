'use client';

import { BookOpen, Calculator, Download, Trash2, PlusCircle } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Link from 'next/link';

export default function HowToUse() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      <NavBar />
      <h1 className="text-3xl font-bold text-center text-blue-700 my-8">
        📘 How to Use the GPA Calculator
      </h1>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1️⃣ Add Your Courses</h2>
          <p>
            Start by entering your course details in the form at the top of the page:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li><strong>Course Name:</strong> The title or code of your course (e.g., ENG 101).</li>
            <li><strong>Credit Units:</strong> The number of credit hours for the course.</li>
            <li><strong>Grade:</strong> Select your earned grade (A–F).</li>
            <li><strong>Grading Scale:</strong> Choose whether your school uses a 4-point or 5-point system.</li>
            <li><strong>Semester & Level:</strong> Indicate when the course was taken (e.g., “First Semester, 200L”).</li>
          </ul>

          <div className="flex items-center gap-2 mt-4 bg-blue-50 p-3 rounded-lg text-blue-700">
            <PlusCircle size={18} />
            <p>Click <strong>Add Course</strong> to include it in your GPA list.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2️⃣ Review or Remove Courses</h2>
          <p>
            After adding, your courses will appear in a table grouped by grading scale.  
            You can verify all the details or remove any incorrect entries.
          </p>
          <div className="flex items-center gap-2 mt-4 bg-red-50 p-3 rounded-lg text-red-700">
            <Trash2 size={18} />
            <p>Click the red <strong>delete icon</strong> beside a course to remove it.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3️⃣ Calculate Your GPA</h2>
          <p>
            When you’ve entered all your courses, click the green button below your table to calculate your GPA.
          </p>
          <div className="flex items-center gap-2 mt-4 bg-green-50 p-3 rounded-lg text-green-700">
            <Calculator size={18} />
            <p>Click <strong>Calculate GPA</strong> to see your overall GPA and classification.</p>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            The system automatically computes both the weighted average and your classification  
            (e.g., <strong>First Class</strong>, <strong>Second Class Upper</strong>).
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4️⃣ Download Your GPA Report</h2>
          <p>
            Once your GPA is calculated, you can save your results as a PDF report for future reference or sharing.
          </p>
          <div className="flex items-center gap-2 mt-4 bg-red-50 p-3 rounded-lg text-red-700">
            <Download size={18} />
            <p>Click <strong>Download PDF</strong> to save your report instantly.</p>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">💡 Notes</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
            <li>You can mix both 4-point and 5-point scale courses; the system will handle them accurately.</li>
            <li>Your data is stored locally in your browser — no login required.</li>
            <li>If you reload or clear your browser cache, your courses may be removed.</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <BookOpen size={20} />
            Go Back to GPA Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
