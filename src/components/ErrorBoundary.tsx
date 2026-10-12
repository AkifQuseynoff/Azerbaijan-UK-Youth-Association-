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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-mist px-6">
        <div className="card max-w-md p-10 text-center">
          <h1 className="display mb-3 text-3xl">Something went wrong</h1>
          <p className="text-mute text-sm mb-6">An unexpected error occurred. Reloading the page usually fixes it.</p>
          <button type="button" onClick={() => window.location.reload()} className="btn btn-blue">
            Reload
          </button>
        </div>
      </div>
    );
  }
}
