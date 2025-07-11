import { createTheme } from "@mui/material/styles";

// Определяем варианты цветовых тем
const themeVariants = {
  // Тема Telegram Dark
  telegramDark: {
    // Основные цвета
    primary: {
      main: "#8774e1" /* #8774e1 */, // Фиолетовый (как в Telegram)
      light: "#b39ddb" /* #b39ddb */,
      dark: "#6a4caf" /* #6a4caf */,
      contrastText: "#ffffff" /* #ffffff */,
    },
    // Цвета фона
    background: {
      default: "#17212b" /* #17212b */, // Темно-синий фон (как в Telegram)
      paper: "#232e3c" /* #232e3c */, // Фон компонентов
      darker: "#0f1923" /* #0f1923 */, // Более темный фон
      lighter: "#2b5278" /* #2b5278 */, // Более светлый фон (как акцент в Telegram)
    },
    // Цвета текста
    text: {
      primary: "#ffffff" /* #ffffff */, // Основной текст
      secondary: "#91a3b5" /* #91a3b5 */, // Вторичный текст
      disabled: "#5d6c7b" /* #5d6c7b */, // Отключенный текст
    },
    // Дополнительные цвета
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: "#ffffff" /* #ffffff */,
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },
  
  // Оригинальная темная тема
  dark: {
    // Основные цвета
    primary: {
      main: "#2196f3" /* #2196f3 */, // Синий
      light: "#64b5f6" /* #64b5f6 */,
      dark: "#1976d2" /* #1976d2 */,
      contrastText: "#ffffff" /* #ffffff */,
    },
    // Цвета фона
    background: {
      default: "#121212" /* #121212 */, // Основной фон
      paper: "#1E1E1E" /* #1E1E1E */, // Фон компонентов
      darker: "#0A0A0A" /* #0A0A0A */, // Темный фон (например для модалок)
      lighter: "#2C2C2C" /* #2C2C2C */, // Светлый фон (например для hover)
    },
    // Цвета текста
    text: {
      primary: "#ffffff" /* #ffffff */, // Основной текст
      secondary: "#B3B3B3" /* #B3B3B3 */, // Вторичный текст
      disabled: "#666666" /* #666666 */, // Отключенный текст
    },
    // Дополнительные цвета
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: "#ffffff" /* #ffffff */,
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },
  
  // Темно-серая тема
  darkGray: {
    // Основные цвета
    primary: {
      main: "#78909c" /* #78909c */, // Серо-голубой
      light: "#a7c0cd" /* #a7c0cd */,
      dark: "#4b636e" /* #4b636e */,
      contrastText: "#ffffff" /* #ffffff */,
    },
    // Цвета фона
    background: {
      default: "#263238" /* #263238 */, // Темно-серый фон
      paper: "#37474f" /* #37474f */, // Серый фон компонентов
      darker: "#1c2529" /* #1c2529 */, // Более темный серый
      lighter: "#455a64" /* #455a64 */, // Более светлый серый
    },
    // Цвета текста
    text: {
      primary: "#eceff1" /* #eceff1 */, // Светло-серый текст
      secondary: "#b0bec5" /* #b0bec5 */, // Серый текст
      disabled: "#78909c" /* #78909c */, // Отключенный текст
    },
    // Дополнительные цвета
    divider: "rgba(236, 239, 241, 0.12)",
    action: {
      active: "#eceff1" /* #eceff1 */,
      hover: "rgba(236, 239, 241, 0.08)",
      selected: "rgba(236, 239, 241, 0.16)",
      disabled: "rgba(236, 239, 241, 0.3)",
      disabledBackground: "rgba(236, 239, 241, 0.12)",
    },
  },
  
  // Дымчатая тема
  smoky: {
    // Основные цвета
    primary: {
      main: "#5c6bc0" /* #5c6bc0 */, // Индиго
      light: "#8e99f3" /* #8e99f3 */,
      dark: "#26418f" /* #26418f */,
      contrastText: "#ffffff" /* #ffffff */,
    },
    // Цвета фона
    background: {
      default: "#303030" /* #303030 */, // Дымчатый фон
      paper: "#424242" /* #424242 */, // Фон компонентов
      darker: "#212121" /* #212121 */, // Темный фон
      lighter: "#616161" /* #616161 */, // Светлый фон
    },
    // Цвета текста
    text: {
      primary: "#f5f5f5" /* #f5f5f5 */, // Светлый текст
      secondary: "#bdbdbd" /* #bdbdbd */, // Серый текст
      disabled: "#757575" /* #757575 */, // Отключенный текст
    },
    // Дополнительные цвета
    divider: "rgba(245, 245, 245, 0.12)",
    action: {
      active: "#f5f5f5" /* #f5f5f5 */,
      hover: "rgba(245, 245, 245, 0.08)",
      selected: "rgba(245, 245, 245, 0.16)",
      disabled: "rgba(245, 245, 245, 0.3)",
      disabledBackground: "rgba(245, 245, 245, 0.12)",
    },
  },
  
  // Темно-голубая тема
  darkBlue: {
    // Основные цвета
    primary: {
      main: "#4fc3f7" /* #4fc3f7 */, // Голубой
      light: "#8bf6ff" /* #8bf6ff */,
      dark: "#0093c4" /* #0093c4 */,
      contrastText: "#ffffff" /* #ffffff */,
    },
    // Цвета фона
    background: {
      default: "#102027" /* #102027 */, // Темно-синий фон
      paper: "#1c313a" /* #1c313a */, // Синий фон компонентов
      darker: "#0d1a21" /* #0d1a21 */, // Более темный синий
      lighter: "#29434e" /* #29434e */, // Более светлый синий
    },
    // Цвета текста
    text: {
      primary: "#e0f7fa" /* #e0f7fa */, // Светло-голубой текст
      secondary: "#b2ebf2" /* #b2ebf2 */, // Голубой текст
      disabled: "#80deea" /* #80deea */, // Отключенный текст
    },
    // Дополнительные цвета
    divider: "rgba(224, 247, 250, 0.12)",
    action: {
      active: "#e0f7fa" /* #e0f7fa */,
      hover: "rgba(224, 247, 250, 0.08)",
      selected: "rgba(224, 247, 250, 0.16)",
      disabled: "rgba(224, 247, 250, 0.3)",
      disabledBackground: "rgba(224, 247, 250, 0.12)",
    },
  },
};

// Экспортируем доступные темы для использования в других компонентах
export const THEME_VARIANTS = {
  TELEGRAM_DARK: 'telegramDark',
  DARK: 'dark',
  DARK_GRAY: 'darkGray',
  SMOKY: 'smoky',
  DARK_BLUE: 'darkBlue'
};

// Функция создания темы с возможностью выбора варианта
export const createTelegramTheme = (themeVariant = THEME_VARIANTS.TELEGRAM_DARK) => {
  // Проверяем, существует ли запрошенный вариант темы
  const selectedTheme = themeVariants[themeVariant] || themeVariants[THEME_VARIANTS.TELEGRAM_DARK];
  
  return createTheme({
    palette: {
      mode: "dark",
      ...selectedTheme,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: selectedTheme.background.default,
            color: selectedTheme.text.primary,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: selectedTheme.background.default,
            },
            "&::-webkit-scrollbar-thumb": {
              background: selectedTheme.background.lighter,
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: selectedTheme.primary.main,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 500,
            padding: "8px 16px",
          },
          contained: {
            backgroundColor: selectedTheme.primary.main,
            "&:hover": {
              backgroundColor: selectedTheme.primary.dark,
            },
          },
          outlined: {
            borderColor: selectedTheme.primary.main,
            color: selectedTheme.primary.main,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              backgroundColor: selectedTheme.background.lighter,
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.23)",
              },
              "&:hover fieldset": {
                borderColor: selectedTheme.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: selectedTheme.primary.main,
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: selectedTheme.background.paper,
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: selectedTheme.background.paper,
            backgroundImage: "none",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: selectedTheme.text.primary,
            "&:hover": {
              backgroundColor: selectedTheme.action.hover,
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: selectedTheme.divider,
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Roboto", "Arial", sans-serif',
      h6: {
        fontWeight: 500,
        fontSize: "1.125rem",
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
  });
};
