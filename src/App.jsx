import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { Route, Routes, useLocation } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "./theme/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import BasePage from "./components/ui/BaseForm";
import { initTelegramUtils, saveParamsFromUrlToStorage } from "./utils/telegramUtils";

import MainForm from "./components/Main/MainForm";
import ProductsForm from "./components/Products/ProductsList";
import ProductEdit from "./components/Products/ProductEdit";
import SettingsForm from "./components/Settings/SettingsPage";

function App() {
  const { WebApp, isTelegramEnvironment, twa, showNotification } = useTelegram();
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

  // Пример элементов меню с колбэками
  const mainPageMenuItems = [
    {
      name: "products",
      title: "Перейти к товарам",
      callback: () => {
        location.href = "/ProductsForm";
        showNotification("Переход к товарам", "info");
      }
    },
    {
      name: "settings",
      title: "Настройки",
      callback: () => {
        location.href = "/settings";
        showNotification("Переход к настройкам", "info");
      }
    },
    {
      name: "notification",
      title: "Показать уведомление",
      callback: () => {
        showNotification("Это тестовое уведомление", "success");
      }
    }
  ];

  return (
    <ThemeProvider>
      <CssBaseline />
      <ErrorBoundary>
        <div className="App">
          <Routes>
            <Route
              index
              element={<BasePage pageTitle="Главная страница" menuItems={mainPageMenuItems}><MainForm /></BasePage>}
              errorElement={<ErrorBoundary pageTitle="Главная страница" />}
            />
            <Route
              path="BasePage"
              element={<BasePage pageTitle="Base Page"></BasePage>}
              errorElement={<ErrorBoundary pageTitle="Base Page" />}
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
              element={<BasePage pageTitle="Настройки"><SettingsForm /></BasePage>}
              errorElement={<ErrorBoundary pageTitle="Настройки" />}
            />
          </Routes>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
