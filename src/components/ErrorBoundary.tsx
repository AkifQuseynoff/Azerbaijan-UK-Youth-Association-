import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

type State = { failed: boolean };

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled UI error", error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FB] px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#0D1B2A] mb-3">Something went wrong</h1>
          <p className="text-gray-600 text-sm mb-6">An unexpected error occurred. Reloading the page usually fixes it.</p>
          <button type="button" onClick={() => window.location.reload()} className="px-6 py-3 bg-[#003580] text-white font-semibold rounded-xl">
            Reload
          </button>
        </div>
      </div>
    );
  }
}
