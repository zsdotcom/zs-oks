import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from './icons/lucide-shim';

interface Props {
  children: ReactNode;
  panelName: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PanelErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-40 p-4 text-center">
          <AlertTriangle size={20} className="text-red-400 mb-2" />
          <p className="text-xs font-medium text-(--text-primary) mb-1">{this.props.panelName} crashed</p>
          <p className="text-[10px] text-(--text-muted) mb-3 max-w-xs truncate">{this.state.error?.message}</p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-(--accent) text-white hover:bg-(--accent-dark)"
          >
            <RefreshCw size={10} /> Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
