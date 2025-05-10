'use client';

const AuthErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 font-sans text-center p-5">
            <h1 className="text-4xl font-bold mb-4">
                Authentication Error
            </h1>
            <p className="text-base mb-8">
                Oops! Something went wrong during authentication. Please try again.
            </p>
            <button 
                className="px-6 py-3 text-base text-white bg-primary rounded-lg hover:bg-primary/80 transition-colors"
                onClick={() => window.location.href = '/auth/Register'}
            >
                Go to Login
            </button>
        </div>
    );
};

export default AuthErrorPage;