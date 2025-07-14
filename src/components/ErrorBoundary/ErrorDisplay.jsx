import React from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  Paper, 
  Alert,
  Divider
} from '@mui/material';
import {
  Refresh,
  ContentCopy,
  RestartAlt
} from '@mui/icons-material';

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
    <Box 
      sx={{ 
        p: 2, 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Paper 
        elevation={24}
        sx={{ 
          p: 4, 
          maxWidth: 650,
          width: '100%',
          borderRadius: 4,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1)'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: '#f44336',
            mb: 3
          }}
        >
          Ошибка
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8, #6a42a0)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Перезагрузить приложение
          </Button>
          
          {onReset && (
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<RestartAlt />}
              onClick={onReset}
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 3,
                textTransform: 'none',
                borderWidth: 2,
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#5a6fd8',
                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Попробовать снова
            </Button>
          )}
          
          <Button
            variant="contained"
            fullWidth
            startIcon={<ContentCopy />}
            onClick={copyErrorToClipboard}
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              backgroundColor: '#ff9800',
              color: 'white',
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(255, 152, 0, 0.3)',
              '&:hover': {
                backgroundColor: '#f57c00',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Копировать детали ошибки
          </Button>
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              textAlign: 'left',
              borderRadius: 3,
              border: '1px solid rgba(244, 67, 54, 0.2)',
              backgroundColor: 'rgba(244, 67, 54, 0.02)',
              '& .MuiAlert-message': {
                width: '100%'
              },
              '& .MuiAlert-icon': {
                color: '#f44336'
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#d32f2f' }}>
              Техническая информация:
            </Typography>
            <Box sx={{ 
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              borderRadius: 2,
              p: 2,
              mt: 1,
              border: '1px solid rgba(244, 67, 54, 0.1)'
            }}>
              <Typography 
                component="pre" 
                sx={{ 
                  fontSize: '0.8rem',
                  fontFamily: 'Consolas, Monaco, \"Courier New\", monospace',
                  overflow: 'auto',
                  color: '#d32f2f',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.4
                }}
              >
                {error.toString()}
              </Typography>
              {errorInfo?.componentStack && (
                <>
                  <Divider sx={{ my: 1.5, backgroundColor: 'rgba(244, 67, 54, 0.2)' }} />
                  <Typography 
                    component="pre" 
                    sx={{ 
                      fontSize: '0.75rem',
                      fontFamily: 'Consolas, Monaco, \"Courier New\", monospace',
                      overflow: 'auto',
                      color: '#666',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      lineHeight: 1.3
                    }}
                  >
                    {errorInfo.componentStack}
                  </Typography>
                </>
              )}
            </Box>
          </Alert>
        )}
      </Paper>
    </Box>
  );
};