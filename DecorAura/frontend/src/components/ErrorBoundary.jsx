import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('DecorAura Root ErrorBoundary caught an exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-6 text-charcoal-900 font-sans">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-ivory-300 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-ivory-200 text-bronze-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h1 className="text-3xl font-serif tracking-tight mb-2">DecorAura</h1>
            <p className="text-xs font-sans uppercase tracking-widest text-bronze-600 font-semibold mb-4">
              Experience Interrupted
            </p>
            <p className="text-sm font-sans text-charcoal-500 mb-6 leading-relaxed">
              Something interrupted the luxury visual experience. We've captured the error diagnostics and prepared recovery.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3.5 px-6 bg-charcoal-900 hover:bg-bronze-500 text-white rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <RefreshCw size={14} /> Reload Experience
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
