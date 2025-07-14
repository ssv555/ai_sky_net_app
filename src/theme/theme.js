import { createTheme } from "@mui/material/styles";
import { THEME_VARIANTS, themeVariants } from './themeConfig';

export const createTelegramTheme = (themeVariant = THEME_VARIANTS.TELEGRAM_DARK) => {
  const selectedTheme = themeVariants[themeVariant] || themeVariants[THEME_VARIANTS.TELEGRAM_DARK];
  
  return createTheme({
    palette: {
      mode: "dark",
      ...selectedTheme
    }
  });
};

export const applyTelegramTheme = (themeParams) => {
  if (!themeParams || typeof window === "undefined") return;
  const root = document.documentElement;
  Object.entries(themeParams).forEach(([key, value]) => {
    if (key && value) {
      root.style.setProperty(`--tg-theme-${key.replace(/_/g, "-")}`, value);
    }
  });
};