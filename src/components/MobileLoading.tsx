import React from 'react';
import { Loader2 } from 'lucide-react';

interface MobileLoadingProps {
    message?: string;
    showProgress?: boolean;
    progress?: number;
}

const MobileLoading: React.FC<MobileLoadingProps> = ({
    message = "Loading...",
    showProgress = false,
    progress = 0
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center max-w-sm w-full">
                {/* Main loading spinner */}
                <div className="relative mb-6">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600" />

                    {/* Progress ring for mobile */}
                    {showProgress && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin">
                                <div className="w-full h-full rounded-full bg-transparent"
                                    style={{
                                        background: `conic-gradient(from 0deg, #4f46e5 ${progress * 3.6}deg, #e5e7eb ${progress * 3.6}deg)`
                                    }}>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading message */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {message}
                </h2>

                {/* Progress text */}
                {showProgress && (
                    <p className="text-sm text-gray-600 mb-4">
                        {Math.round(progress)}% complete
                    </p>
                )}

                {/* Mobile-friendly loading dots */}
                <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>

                {/* Mobile-specific hint */}
                <p className="text-xs text-gray-500 mt-4">
                    Please don't close this page
                </p>
            </div>
        </div>
    );
};

export default MobileLoading; 