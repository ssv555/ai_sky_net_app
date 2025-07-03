import React from "react";
import { Button } from "@mui/material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Ошибка в компоненте:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Что-то пошло не так 😕</h2>
          <p>Произошла ошибка</p>

          {this.state.error && (
            <div className="error-details">
              <h3>Детали ошибки:</h3>
              <pre className="error-message">
                {this.state.error?.toString()}
              </pre>
              <pre className="error-stack">
                {this.state.errorInfo?.componentStack}
              </pre>
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
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
