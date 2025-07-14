import React from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';

export const ErrorDisplay = ({ error, errorInfo, onReset }) => {
  const copyErrorToClipboard = () => {
    const errorText = `Ошибка: ${error?.toString() || 'Неизвестная ошибка'}\n\nСтек вызовов:\n${errorInfo?.componentStack || 'Недоступно'}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(errorText).then(() => {
        alert('Текст ошибки скопирован в буфер обмена');
      }).catch(() => {
        alert('Не удалось скопировать текст');
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = errorText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Текст ошибки скопирован в буфер обмена');
    }
  };

  return (
    <Box sx={{ p: 1.25, textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ 
        p: 3, 
        backgroundColor: '#f5f5f5',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        width: '100%',
        minWidth: '300px'
      }}>
        <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold', mb: 2 }}>
          Ошибка
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="small"
            onClick={() => window.location.reload()}
          >
            ПЕРЕЗАГРУЗИТЬ
          </Button>
          {onReset && (
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              size="small"
              onClick={onReset}
            >
              ПОПРОБОВАТЬ СНОВА
            </Button>
          )}
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            size="small"
            onClick={copyErrorToClipboard}
          >
            КОПИРОВАТЬ
          </Button>
        </Box>
        
        {process.env.NODE_ENV === 'development' && error && (
          <Box sx={{ 
            textAlign: 'left',
            backgroundColor: '#fafafa',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 2
          }}>
            <pre style={{ 
              fontSize: '12px', 
              overflow: 'auto',
              color: '#d32f2f',
              backgroundColor: 'white',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #e0e0e0',
              margin: 0
            }}>
              {error.toString()}
            </pre>
            {errorInfo?.componentStack && (
              <pre style={{ 
                fontSize: '10px', 
                overflow: 'auto',
                color: '#666',
                backgroundColor: 'white',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
                marginTop: '8px',
                marginBottom: 0
              }}>
                {errorInfo.componentStack}
              </pre>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};