import { createTheme } from "@mui/material/styles";

// Определяем основные цвета темы
const darkThemeColors = {
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
};

export const createTelegramTheme = () => {
  return createTheme({
    palette: {
      mode: "dark",
      ...darkThemeColors,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: darkThemeColors.background.default,
            color: darkThemeColors.text.primary,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: darkThemeColors.background.default,
            },
            "&::-webkit-scrollbar-thumb": {
              background: darkThemeColors.background.lighter,
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: darkThemeColors.primary.main,
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
            backgroundColor: darkThemeColors.primary.main,
            "&:hover": {
              backgroundColor: darkThemeColors.primary.dark,
            },
          },
          outlined: {
            borderColor: darkThemeColors.primary.main,
            color: darkThemeColors.primary.main,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              backgroundColor: darkThemeColors.background.lighter,
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.23)",
              },
              "&:hover fieldset": {
                borderColor: darkThemeColors.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: darkThemeColors.primary.main,
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: darkThemeColors.background.paper,
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkThemeColors.background.paper,
            backgroundImage: "none",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: darkThemeColors.text.primary,
            "&:hover": {
              backgroundColor: darkThemeColors.action.hover,
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: darkThemeColors.divider,
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
