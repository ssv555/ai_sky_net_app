import React from 'react';
import { Button } from '@mui/material';

export const ErrorDisplay = ({ error, errorInfo }) => {
  return (
    <div className="error-boundary">
      <h2>Что-то пошло не так</h2>
      <p>Произошла ошибка</p>

      {error && (
        <div className="error-details">
          <h3>Детали ошибки:</h3>
          <pre className="error-message">{error.toString()}</pre>
          <pre className="error-stack">{errorInfo?.componentStack}</pre>
        </div>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={() => window.location.reload()}
      >
        Перезагрузить страницу
      </Button>
    </div>
  );
};