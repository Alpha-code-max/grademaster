import NavBar from "@/components/NavBar";
import Register from "@/auth-components/Register";

export default function RegisterPage() {
    return (
        <div>
            <NavBar />
            <div className="bg-background mt-12">
                <Register />
            </div>
        </div>
    )
}
