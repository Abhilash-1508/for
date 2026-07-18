import React from 'react';
import { MdErrorOutline } from 'react-icons/md';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-forest p-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 max-w-md w-full shadow-lg text-center space-y-6 animate-fade-in">
            <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-2xl">
              <MdErrorOutline className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-gray-800 font-display">Something went wrong</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                An unexpected UI crash occurred on this page. This could be due to malformed API data or offline synchronization issues.
              </p>
            </div>
            {this.state.error && (
              <div className="p-3 bg-gray-50 rounded-xl text-left border border-gray-100">
                <p className="text-[10px] font-mono text-red-600 break-words font-semibold">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full bg-forest-green hover:bg-forest-dark text-white font-extrabold py-3 rounded-xl text-xs transition-all shadow-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
