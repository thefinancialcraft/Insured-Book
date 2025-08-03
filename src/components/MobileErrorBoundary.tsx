import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class MobileErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Mobile Error Boundary caught an error:', error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    private handleGoToLogin = () => {
        window.location.href = '/login';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="text-center max-w-md">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                            <h2 className="text-lg font-semibold text-red-800 mb-2">
                                Something went wrong
                            </h2>
                            <p className="text-red-600 text-sm mb-4">
                                We encountered an unexpected error. This might be due to a mobile-specific issue.
                            </p>
                            {this.state.error && (
                                <details className="text-left">
                                    <summary className="text-red-600 text-sm cursor-pointer mb-2">
                                        Error Details
                                    </summary>
                                    <pre className="text-xs text-red-500 bg-red-100 p-2 rounded overflow-auto">
                                        {this.state.error.message}
                                    </pre>
                                </details>
                            )}
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={this.handleRetry}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoToLogin}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Go to Login
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default MobileErrorBoundary; 