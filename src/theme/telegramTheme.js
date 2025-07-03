import { createTheme } from "@mui/material/styles";

// Функция для получения значения CSS переменной с фоллбэком
const getCssVariableValue = (variableName, fallback) => {
  if (typeof window !== "undefined") {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
    return value || fallback;
  }
  return fallback;
};

// Создаем тему, которая будет использовать цвета из Telegram Web App
export const createTelegramTheme = (colorScheme = "light") => {
  // Получаем актуальные значения переменных
  const buttonColor = getCssVariableValue("--tg-theme-button-color", "#3390ec");
  const buttonTextColor = getCssVariableValue(
    "--tg-theme-button-text-color",
    "#ffffff"
  );
  const bgColor = getCssVariableValue("--tg-theme-bg-color", "#ffffff");
  const secondaryBgColor = getCssVariableValue(
    "--tg-theme-secondary-bg-color",
    "#f4f4f5"
  );
  const textColor = getCssVariableValue("--tg-theme-text-color", "#000000");
  const hintColor = getCssVariableValue("--tg-theme-hint-color", "#999999");

  return createTheme({
    palette: {
      mode: colorScheme,
      primary: {
        main: buttonColor,
        contrastText: buttonTextColor,
      },
      background: {
        default: bgColor,
        paper: secondaryBgColor,
      },
      text: {
        primary: textColor,
        secondary: hintColor,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 500,
            padding: "8px 16px",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: secondaryBgColor,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: textColor,
          },
          head: {
            fontWeight: 600,
          },
        },
      },
    },
  });
};
