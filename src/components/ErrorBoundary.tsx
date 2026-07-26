import React from 'react';
import { AlertTriangle, RefreshCw } from './icons/lucide-shim';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[OKS ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-[#0f0f1a] text-gray-200">
          <div className="text-center max-w-md p-8">
            <AlertTriangle size={48} className="mx-auto mb-4 text-red-400" />
            <h1 className="text-lg font-semibold mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              <RefreshCw size={14} /> Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
