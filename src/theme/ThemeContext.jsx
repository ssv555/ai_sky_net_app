import React, { createContext, useContext, useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { createTelegramTheme } from './theme';
import { THEME_VARIANTS } from './themeConfig';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(THEME_VARIANTS.TELEGRAM_DARK);

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && Object.values(THEME_VARIANTS).includes(savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (themeVariant) => {
    if (Object.values(THEME_VARIANTS).includes(themeVariant)) {
      setCurrentTheme(themeVariant);
      localStorage.setItem('selectedTheme', themeVariant);
    }
  };

  const theme = createTelegramTheme(currentTheme);

  // Применяем CSS-переменные
  useEffect(() => {
    const root = document.documentElement;
    const selectedTheme = theme.palette;
    
    root.style.setProperty('--theme-bg-color', selectedTheme.background.default);
    root.style.setProperty('--theme-text-color', selectedTheme.text.primary);
    root.style.setProperty('--theme-primary-color', selectedTheme.primary.main);
    root.style.setProperty('--theme-secondary-color', selectedTheme.text.secondary);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ 
      theme,
      currentTheme,
      changeTheme,
      themeVariants: THEME_VARIANTS
    }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }
  return context;
};