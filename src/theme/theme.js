import { createTheme } from "@mui/material/styles";

export const THEME_VARIANTS = {
  TELEGRAM_DARK: 'telegramDark',
  DARK: 'dark',
  DARK_GRAY: 'darkGray',
  SMOKY: 'smoky',
  DARK_BLUE: 'darkBlue'
};

export const themeVariants = {
  telegramDark: {
    primary: {
      main: "#8774e1",
      light: "#b39ddb",
      dark: "#6a4caf",
      contrastText: "#ffffff"
    },
    background: {
      default: "#17212b",
      paper: "#232e3c",
      darker: "#0f1923",
      lighter: "#2b5278"
    },
    text: {
      primary: "#ffffff",
      secondary: "#91a3b5",
      disabled: "#5d6c7b"
    },
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: "#ffffff",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)"
    }
  },
  dark: {
    primary: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#ffffff"
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
      darker: "#000000",
      lighter: "#2c2c2c"
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
      disabled: "#666666"
    },
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: "#ffffff",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)"
    }
  },
  darkGray: {
    primary: {
      main: "#78909c",
      light: "#a7c0cd",
      dark: "#4b636e",
      contrastText: "#ffffff"
    },
    background: {
      default: "#263238",
      paper: "#37474f",
      darker: "#1c2833",
      lighter: "#455a64"
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
      disabled: "#78909c"
    },
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: "#ffffff",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)"
    }
  },
  smoky: {
    primary: {
      main: "#5c6bc0",
      light: "#8e99f3",
      dark: "#26418f",
      contrastText: "#ffffff"
    },
    background: {
      default: "#2c2c54",
      paper: "#40407a",
      darker: "#1a1a2e",
      lighter: "#535387"
    },
    text: {
      primary: "#ffffff",
      secondary: "#c7ecee",
      disabled: "#9575cd"
    },
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: "#ffffff",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)"
    }
  },
  darkBlue: {
    primary: {
      main: "#4fc3f7",
      light: "#8bf6ff",
      dark: "#0093c4",
      contrastText: "#000000"
    },
    background: {
      default: "#0d47a1",
      paper: "#1565c0",
      darker: "#002171",
      lighter: "#1976d2"
    },
    text: {
      primary: "#ffffff",
      secondary: "#bbdefb",
      disabled: "#64b5f6"
    },
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: "#ffffff",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)"
    }
  }
};

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