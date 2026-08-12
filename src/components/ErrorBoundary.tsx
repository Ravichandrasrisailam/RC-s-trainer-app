import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full min-h-screen bg-[#060608] text-zinc-200 flex items-center justify-center p-4 select-none font-sans">
          <div className="w-full max-w-md bg-[#121216] border border-red-500/30 rounded-3xl p-6 shadow-2xl space-y-5 animate-fadeIn backdrop-blur-xl">
            {/* Header Badge */}
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-white font-bitcount text-sm tracking-wide">Application Error Fallback</h2>
                  <p className="text-red-400 font-mono text-[9px] uppercase tracking-wider">RC Trainer Recovery System</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                500 SAFE MODE
              </span>
            </div>

            {/* Error Message Notice */}
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-red-400 font-bitcount text-xs">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>An unexpected UI exception occurred</span>
              </div>
              <p className="text-zinc-300 text-xs font-mono font-light leading-relaxed">
                {this.state.error?.message || 'A client-side runtime error was prevented from crashing the interface.'}
              </p>
            </div>

            {/* Technical stack detail toggle */}
            {this.state.errorInfo && (
              <details className="text-[10px] font-mono bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-zinc-400">
                <summary className="cursor-pointer text-zinc-300 font-light hover:text-white">
                  Technical Stack Diagnostics
                </summary>
                <pre className="mt-2 text-[9px] text-zinc-500 overflow-x-auto whitespace-pre-wrap font-mono leading-tight max-h-32">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={this.handleReset}
                className="w-full bg-red-600/90 hover:bg-red-500 text-white font-bitcount text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-500/30"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recover Component State</span>
              </button>

              <button
                onClick={this.handleReload}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-zinc-800 font-light"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reload Application Frame</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
