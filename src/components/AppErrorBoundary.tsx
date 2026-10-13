import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onErrorFallback: () => void;
}

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AppErrorBoundary] Micro-app component caught error:', error, errorInfo);
    this.props.onErrorFallback();
  }

  public render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
