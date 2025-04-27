import Input from "@/components/Input";
import NavBar from "@/components/NavBar";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">

        <NavBar/> 

        <div className="h-2"></div>
        
      <form className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-primary">Login</h2>

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
          Login
        </button>

        <p className="text-center tiny text-gray-500">
          I don't have an account? <span className="text-blue-600 cursor-pointer hover:underline">Sign Up</span>
        </p>
      </form>
    </div>
  );
}
