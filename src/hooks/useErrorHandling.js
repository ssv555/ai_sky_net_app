import { useState, useCallback } from 'react';

export const useErrorHandling = () => {
  const [errorState, setErrorState] = useState({
    hasError: false,
    error: null,
    errorInfo: null
  });

  const handleError = useCallback((error, errorInfo) => {
    console.error("Ошибка в компоненте:", error, errorInfo);
    setErrorState({
      hasError: true,
      error,
      errorInfo
    });
  }, []);

  const resetError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }, []);

  return { errorState, handleError, resetError };
};