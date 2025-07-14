import { createTheme } from "@mui/material/styles";
import { THEME_VARIANTS, themeVariants } from './themeConfig';

// Функция создания темы с возможностью выбора варианта
export const createTelegramTheme = (themeVariant = THEME_VARIANTS.TELEGRAM_DARK) => {
  const selectedTheme = themeVariants[themeVariant] || themeVariants[THEME_VARIANTS.TELEGRAM_DARK];
  
  return createTheme({
    palette: {
      mode: "dark",
      ...selectedTheme
    },
    // ... остальные настройки темы остаются без изменений
  });
};
export const THEME_VARIANTS = {
  TELEGRAM_DARK: 'telegramDark',
  DARK: 'dark',
  DARK_GRAY: 'darkGray',
  SMOKY: 'smoky',
  DARK_BLUE: 'darkBlue'
};
