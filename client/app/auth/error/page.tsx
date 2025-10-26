'use client';

import React from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

interface AuthErrorPageProps {
    errorMessage?: string;
    errorCode?: string;
    onRetry?: () => void;
}

const AuthErrorPage: React.FC<AuthErrorPageProps> = ({
    errorMessage = 'Something went wrong during authentication',
    errorCode = '401',
    onRetry,
}) => {
    const handleRetry = (): void => {
        if (onRetry) {
            onRetry();
        } else {
            window.location.reload();
        }
    };

    const handleGoHome = (): void => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                {/* Error Container */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header with error indicator */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 flex flex-col items-center">
                        <div className="bg-white/20 rounded-full p-4 mb-4">
                            <AlertCircle className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white">Error {errorCode}</h1>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Authentication Failed
                        </h2>
                        <p className="text-gray-600 text-base mb-8 leading-relaxed">
                            {errorMessage}
                        </p>

                        {/* Error Details Box */}
                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-8">
                            <p className="text-sm text-red-700">
                                Please try logging in again or contact support if the problem persists.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.href = '/auth/login'}
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                            >
                                Return to Login
                            </button>

                            <button
                                onClick={handleRetry}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try Again
                            </button>

                            <button
                                onClick={handleGoHome}
                                className="w-full bg-transparent border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Go Home
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            Need help? <a href="/support" className="text-red-500 hover:text-red-600 font-semibold">Contact Support</a>
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 text-center text-gray-400 text-sm">
                    <p>Error ID: {Math.random().toString(36).substring(2, 11).toUpperCase()}</p>
                </div>
            </div>
        </div>
    );
};

export default AuthErrorPage;