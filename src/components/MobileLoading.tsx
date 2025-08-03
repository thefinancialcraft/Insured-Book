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
        <div className="mobile-loading-container no-select">
            <div className="mobile-loading-content">
                {/* Main loading spinner */}
                <div className="relative mb-6">
                    {showProgress ? (
                        // Progress ring
                        <div className="mobile-progress-ring">
                            {/* Background circle */}
                            <div className="mobile-progress-background"></div>

                            {/* Progress circle */}
                            <div
                                className="mobile-progress-fill"
                                style={{
                                    background: `conic-gradient(from 0deg, #4f46e5 0deg, #4f46e5 ${progress * 3.6}deg, transparent ${progress * 3.6}deg, transparent 360deg)`
                                }}
                            ></div>

                            {/* Center content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-semibold text-indigo-600">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                        </div>
                    ) : (
                        // Regular spinner
                        <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600" />
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