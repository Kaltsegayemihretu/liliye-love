import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center p-6 text-center">
          <div className="glass-card rounded-3xl p-8 max-w-md shadow-2xl border border-white/80 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#ff2a75] text-white flex items-center justify-center text-3xl mx-auto shadow-lg">
              💖
            </div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">
              Till The End Of Time
            </h1>
            <p className="text-sm text-slate-600 font-semibold">
              A temporary loading glitch occurred. Please refresh to load our love story.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full bg-[#ff2a75] text-white font-bold text-xs shadow-md hover:bg-[#e60067]"
            >
              Reload Experience ✨
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
