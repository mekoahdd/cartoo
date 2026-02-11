import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from 'primereact/button';
import { Logger } from '@/Shared/Infrastructure/Logger';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Component to catch and handle React errors
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * Best Practices:
 * - Wraps entire app or major sections
 * - Provides user-friendly error messages
 * - Logs errors for debugging
 * - Allows recovery without full page reload
 * 
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error using centralized Logger service
        Logger.error('ErrorBoundary caught an error', { error, errorInfo });
        
        this.setState({
            error,
            errorInfo,
        });

        // In production, you might want to send to error tracking service:
        // sendToErrorTrackingService(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div 
                    className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
                    role="alert"
                    aria-live="assertive"
                >
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                            <i className="pi pi-exclamation-triangle text-red-600 text-2xl"></i>
                        </div>
                        
                        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Something went wrong
                        </h1>
                        
                        <p className="text-gray-600 text-center mb-6">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 p-4 bg-gray-100 rounded text-sm">
                                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                                    Error Details (Development Only)
                                </summary>
                                <div className="mt-2 text-xs">
                                    <p className="font-semibold text-red-600 mb-1">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <pre className="overflow-auto whitespace-pre-wrap break-words text-gray-600">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    )}
                                </div>
                            </details>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                label="Try Again"
                                icon="pi pi-refresh"
                                className="flex-1"
                                onClick={this.handleReset}
                                severity="secondary"
                                aria-label="Reset the error and try again"
                            />
                            <Button
                                label="Go Home"
                                icon="pi pi-home"
                                className="flex-1"
                                onClick={() => window.location.href = '/'}
                                aria-label="Go to home page"
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
