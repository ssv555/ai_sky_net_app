import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTelegramTheme, THEME_VARIANTS } from './telegramTheme';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';

// Создаем контекст для темы
const ThemeContext = createContext();

// Провайдер контекста темы
export const ThemeProvider = ({ children }) => {
  // Состояние для хранения текущей темы
  const [currentTheme, setCurrentTheme] = useState(THEME_VARIANTS.TELEGRAM_DARK);

  // Функция для изменения темы
  const changeTheme = (themeVariant) => {
    if (Object.values(THEME_VARIANTS).includes(themeVariant)) {
      setCurrentTheme(themeVariant);
      // Сохраняем выбранную тему в localStorage
      localStorage.setItem('selectedTheme', themeVariant);
    }
  };

  // Загружаем сохраненную тему при монтировании компонента
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && Object.values(THEME_VARIANTS).includes(savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Создаем тему с выбранным вариантом
  const theme = createTelegramTheme(currentTheme);

  // Применяем CSS-переменные для всего приложения при изменении темы
  useEffect(() => {
    const root = document.documentElement;
    const selectedTheme = theme.palette;
    
    // Устанавливаем основные цвета как CSS-переменные
    root.style.setProperty('--theme-bg-color', selectedTheme.background.default);
    root.style.setProperty('--theme-text-color', selectedTheme.text.primary);
    root.style.setProperty('--theme-primary-color', selectedTheme.primary.main);
    root.style.setProperty('--theme-secondary-color', selectedTheme.text.secondary);
  }, [theme]);

  // Значение контекста
  const contextValue = {
    theme,
    currentTheme,
    changeTheme,
    themeVariants: THEME_VARIANTS,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Хук для использования контекста темы
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }
  return context;
};