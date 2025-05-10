'use client';

import { SessionProvider, useSession } from "next-auth/react"
import { redirect } from "next/navigation"

// Auth check wrapper component
function AuthCheck({ children }) {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (status === "unauthenticated" || session?.error) {
        redirect('/auth/error')
    }

    return children
}

export const AuthProvider = ({children}) => {
    return (
        <SessionProvider>
            <AuthCheck>
                {children}
            </AuthCheck>
        </SessionProvider>
    )
}