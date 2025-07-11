import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import BasePage from "./components/ui/BasePage";
import { CssBaseline } from "@mui/material";

import MainPage from "./components/MainPage/MainPage";
import ProductsForm from "./components/Products/ProductsForm";
import ProductEdit from "./components/Products/ProductEdit";
import SettingsPage from "./components/SettingsPage/SettingsPage";
import {
  initTelegramUtils,
  saveParamsFromUrlToStorage,
} from "./utils/telegramUtils";

function App() {
  const { WebApp, isTelegramEnvironment, twa } = useTelegram();
  const location = useLocation();

  useEffect(() => {
    initTelegramUtils(WebApp, isTelegramEnvironment);
  }, [WebApp, isTelegramEnvironment]);

  useEffect(() => {
    saveParamsFromUrlToStorage();
  }, [location]);

  useEffect(() => {
    if (twa) {
      twa.expand();
    }
  }, [twa]);

  return (
    <ThemeProvider>
      <CssBaseline />
      <ErrorBoundary>
        <div className="App">
          <Routes>
            <Route
              path="basepage"
              element={<BasePage pageTitle="Base Page"></BasePage>}
              errorElement={<ErrorBoundary pageTitle="Base Page" />}
            />
            <Route
              index
              element={<BasePage pageTitle="Главная страница"><MainPage /></BasePage>}
              errorElement={<ErrorBoundary pageTitle="Главная страница" />}
            />
            <Route
              path="ProductsForm"
              element={<BasePage pageTitle="Товары"><ProductsForm /></BasePage>}
              errorElement={<ErrorBoundary pageTitle="Товары" />}
            />
            <Route
              path="ProductsForm/edit/:id"
              element={<BasePage pageTitle="Редактирование"><ProductEdit /></BasePage>}
              errorElement={<ErrorBoundary pageTitle="Редактирование" />}
            />
            <Route
              path="settings"
              element={<BasePage pageTitle="Настройки"><SettingsPage /></BasePage>}
              errorElement={<ErrorBoundary pageTitle="Настройки" />}
            />
          </Routes>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
