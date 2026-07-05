'use client';

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'global' | 'widget';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, level = 'widget' } = this.props;

    if (hasError && error) {
      const isDev = process.env.NODE_ENV === 'development';

      if (fallback) {
        return fallback;
      }

      return (
        <div className={`error-boundary error-boundary-${level}`}>
          <div className="error-content">
            <strong>Something went wrong</strong>
            {isDev && (
              <>
                <p className="error-message">{error.message}</p>
                <details className="error-stack">
                  <summary>Stack trace</summary>
                  <pre>{error.stack}</pre>
                </details>
              </>
            )}
            <button type="button" onClick={this.handleReset} className="error-reset-btn">
              Try again
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
