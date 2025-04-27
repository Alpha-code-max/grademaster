import Button from "./Button";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-100 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-6">
        <div className="font-bold text-[30px] text-primary">
          <Link href="/">GradeMaster<span className="text-accent">*</span></Link>
        </div>

        <div className="flex items-center gap-6">
          <ul className="flex gap-6 text-gray-700 font-medium">
            <li className="hover:text-blue-600 cursor-pointer"> <Link href="/">Home</Link></li>
            <li className="hover:text-blue-600 cursor-pointer"> <Link href="/About">About</Link></li>
            <li className="hover:text-blue-600 cursor-pointer"> <Link href="/Contact">Contact</Link></li>
          </ul>

          <div className="flex gap-3">
            <Button><Link href="/auth/LoginPage">Login</Link></Button>
            <Button><Link href="/auth/Register">Signup</Link></Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
