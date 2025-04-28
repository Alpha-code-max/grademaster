import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import getUserModel from "@/models/user";

// Signup handler
export async function POST(request) {
    try {
        const { searchParams } = new URL(request.url);
        const authType = searchParams.get('auth');

        console.log('Auth type:', authType); // Debug log

        // Verify getUserModel is working
        const User = await getUserModel();
        if (!User) {
            console.error('User model not initialized');
            return NextResponse.json(
                { message: "Database connection error" },
                { status: 500 }
            );
        }

        if (authType === 'signin') {
            return handleSignin(request);
        }

        // Default to signup
        return handleSignup(request);
    } catch (error) {
        // Enhanced error logging
        console.error('POST route error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        return NextResponse.json(
            { 
                message: "Server error",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined 
            },
            { status: 500 }
        );
    }
}

// Helper function for signup
async function handleSignup(request) {
    try {
        const User = await getUserModel();
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        if (error.code === 11000) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}

// Helper function for signin

export async function GET(request) {
  try {
    const User = await getUserModel(); // No need to call connect separately

    const users = await User.find({}); // Fetch all users
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const User = await getUserModel(); // Again, getUserModel!

    const { id } = await request.json(); // Get user ID

    const result = await User.findByIdAndDelete(id); // Delete user by ID

    if (!result) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
