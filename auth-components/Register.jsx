import Input from "@/components/Input";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-primary">Create an Account</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-xl body hover:bg-blue-700 transition"
        >
          Register
        </button>

        <p className="text-center tiny text-gray-500">
          Already have an account? <span className="text-blue-600 cursor-pointer hover:underline">Login</span>
        </p>
      </form>
    </div>
  );
}
