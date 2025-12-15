import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#1e1e2e] text-white p-8">
          <div className="w-24 h-24 bg-[#f38ba8]/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={48} className="text-[#f38ba8]" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">CRITICAL SYSTEM FAILURE</h1>
          <p className="text-[#a6adc8] max-w-md text-center mb-8 font-mono text-sm">
            {this.state.error?.message || "An unexpected anomaly has occurred in the neural network."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-[#f38ba8] text-[#1e1e2e] font-bold rounded-xl hover:bg-white transition-all"
          >
            <RefreshCw size={20} /> Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}