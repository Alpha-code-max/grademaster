import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import getUserModel from "@/models/user";


export async function POST(request) {
    try {
        const User = await getUserModel();
        
        // Log the raw request
        console.log('Raw request:', request);
        
        let body;
        try {
            body = await request.json();
            console.log('Parsed body:', body);
        } catch (parseError) {
            console.error('Body parse error:', parseError);
            return NextResponse.json(
                { message: "Invalid request body" },
                { status: 400 }
            );
        }
        
        const { email, password } = body;
        
        // Log the extracted credentials
        console.log('Extracted credentials:', { email: !!email, password: !!password });

        if (!email || !password) {
            return NextResponse.json(
                { 
                    message: "Missing required fields",
                    details: {
                        email: !email ? "Email is missing" : null,
                        password: !password ? "Password is missing" : null
                    }
                },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Don't send password in response
        const userWithoutPassword = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        return NextResponse.json(userWithoutPassword, { status: 200 });
    } catch (error) {
        // Enhanced error logging
        console.error("Detailed signin error:", {
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
