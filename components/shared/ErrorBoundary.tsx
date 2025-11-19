"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Send } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (
    error: Error,
    errorInfo: string,
    onReset: () => void
  ) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

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
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console for debugging
    console.error("ErrorBoundary caught an error:", error);
    console.error("Error info:", errorInfo);
    console.error("Component stack:", errorInfo.componentStack);

    this.setState({
      errorInfo: errorInfo.componentStack || "No stack trace available",
    });

    // In production, you would send the error to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReport = () => {
    const { error, errorInfo } = this.state;

    // Create error report
    const report = {
      message: error?.message || "Unknown error",
      stack: error?.stack || "No stack trace",
      componentStack: errorInfo || "No component stack",
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log to console for debugging
    console.log("Error report:", report);

    // In production, send the error report to an error reporting service
    // Example: sendErrorReport(report);

    // Show user feedback
    alert("Error report has been logged. Thank you for helping us improve!");
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error!,
          this.state.errorInfo || "",
          this.handleReset
        );
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-2xl w-full p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
              </div>
              <div className="flex-1 space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  Something went wrong
                </h1>
                <p className="text-muted-foreground">
                  We encountered an unexpected error. This has been logged, and we'll look into it.
                </p>
              </div>
            </div>

            {/* Error details (collapsed by default in production) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="space-y-2">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  Error Details (Development Only)
                </summary>
                <div className="mt-2 p-4 bg-muted rounded-md">
                  <p className="text-sm font-monotext-destructive break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="mt-2 text-xs font-monotext-muted-foreground overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleReset}
                className="flex-1"
                aria-label="Retry loading the application"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Retry
              </Button>
              <Button
                onClick={this.handleReport}
                variant="outline"
                className="flex-1"
                aria-label="Report this error"
              >
                <Send className="size-4" aria-hidden="true" />
                Report Error
              </Button>
            </div>

            {/* Additional help */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                If this problem persists, try refreshing the page or{""}
                <a
                  href="/"
                  className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                >
                  return to the homepage
                </a>
                .
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
