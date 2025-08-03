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
    // Calculate SVG circle parameters
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="mobile-loading-container no-select">
            <div className="mobile-loading-content">
                {/* Main loading spinner */}
                <div className="relative mb-6">
                    {showProgress ? (
                        // SVG Progress ring - more reliable than CSS
                        <div className="relative w-20 h-20 mx-auto">
                            <svg
                                className="w-20 h-20 transform -rotate-90 mobile-progress-svg"
                                viewBox="0 0 80 80"
                            >
                                {/* Background circle */}
                                <circle
                                    cx="40"
                                    cy="40"
                                    r={radius}
                                    stroke="#e5e7eb"
                                    strokeWidth="6"
                                    fill="transparent"
                                />

                                {/* Progress circle */}
                                <circle
                                    cx="40"
                                    cy="40"
                                    r={radius}
                                    stroke="#4f46e5"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeLinecap="round"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    className="mobile-progress-circle"
                                />
                            </svg>

                            {/* Center percentage */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-semibold text-indigo-600">
                                    {Math.round(progress)}%
                                </span>
                            </div>

                            {/* Subtle pulse ring effect */}
                            <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-indigo-200 mobile-pulse-ring"></div>
                        </div>
                    ) : (
                        // Regular spinner with pulse effect
                        <div className="relative">
                            <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600" />
                            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-indigo-200 mobile-pulse-ring"></div>
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
                        Please wait while we process your request...
                    </p>
                )}

                {/* Mobile-friendly loading dots */}
                <div className="mobile-loading-dots">
                    <div className="mobile-loading-dot"></div>
                    <div className="mobile-loading-dot"></div>
                    <div className="mobile-loading-dot"></div>
                </div>

                {/* Mobile-specific hints */}
                <div className="space-y-2">
                    <p className="text-xs text-gray-500">
                        Please don't close this page
                    </p>
                    <p className="text-xs text-gray-400">
                        This may take a few moments on mobile devices
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MobileLoading; 