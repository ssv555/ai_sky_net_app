import React from 'react';
import { ErrorDisplay } from './ErrorDisplay';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    console.error('ErrorBoundary getDerivedStateFromError:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary перехватил ошибку:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.showAlert(`Ошибка: ${error.message}`);
      } catch (e) {
        console.warn('Не удалось показать alert через Telegram WebApp:', e);
      }
    }
  }

  componentDidMount() {
    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  handleError = (event) => {
    console.error('Глобальная ошибка перехвачена ErrorBoundary:', event.error);
    this.setState({
      hasError: true,
      error: event.error || new Error(event.message),
      errorInfo: { componentStack: event.filename + ':' + event.lineno }
    });
  };

  handlePromiseRejection = (event) => {
    console.error('Необработанное отклонение Promise:', event.reason);
    this.setState({
      hasError: true,
      error: event.reason || new Error('Необработанное отклонение Promise'),
      errorInfo: { componentStack: 'Promise rejection' }
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
