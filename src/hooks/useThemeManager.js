import { useState, useEffect } from 'react';
import { THEME_VARIANTS } from '../theme/themeConfig';

export const useThemeManager = () => {
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

  return {
    currentTheme,
    changeTheme,
    themeVariants: THEME_VARIANTS
  };
};