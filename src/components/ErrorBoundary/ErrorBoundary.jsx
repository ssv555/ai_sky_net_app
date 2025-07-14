import React, { useEffect } from 'react';
import { useErrorHandling } from '../../hooks/useErrorHandling';
import { ErrorDisplay } from './ErrorDisplay';

const ErrorBoundary = ({ children }) => {
  const { errorState, handleError } = useErrorHandling();

  useEffect(() => {
    const errorHandler = (error) => {
      handleError(error, { componentStack: error.stack });
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, [handleError]);

  if (errorState.hasError) {
    return (
      <ErrorDisplay
        error={errorState.error}
        errorInfo={errorState.errorInfo}
      />
    );
  }

  return children;
};

export default ErrorBoundary;
