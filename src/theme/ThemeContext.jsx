import React, { createContext, useContext, useState } from 'react';
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
    }
  };

  // Создаем тему с выбранным вариантом
  const theme = createTelegramTheme(currentTheme);

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