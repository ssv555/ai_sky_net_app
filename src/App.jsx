import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "./theme/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import BaseForm from "./components/ui/BaseForm";
import { initTelegramUtils, saveParamsFromUrlToStorage } from "./utils/telegramUtils";

import MainForm from "./components/Main/MainForm";
import ProductsForm from "./components/Products/ProductsList";
import ProductEdit from "./components/Products/ProductEdit";
import SettingsForm from "./components/Settings/SettingsPage";

function App() {
  const { WebApp, isTelegramEnvironment, showNotification } = useTelegram();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initTelegramUtils(WebApp, isTelegramEnvironment);
  }, [WebApp, isTelegramEnvironment]);

  useEffect(() => {
    saveParamsFromUrlToStorage();
  }, [location]);

  useEffect(() => {
    if (WebApp && isTelegramEnvironment) {
      try {
        WebApp.expand();
      } catch (error) {
        console.warn('Ошибка при расширении WebApp:', error);
      }
    }
  }, [WebApp, isTelegramEnvironment]);

  const mainPageMenuItems = [
    {
      name: "products",
      title: "Перейти к товарам",
      callback: () => {
        navigate("/ProductsForm");
        showNotification("Переход к товарам", "info");
      }
    },
    {
      name: "settings",
      title: "Настройки",
      callback: () => {
        navigate("/settings");
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
  <ErrorBoundary>
    <ThemeProvider>
      <CssBaseline />
        <div className="App">
          <Routes>
            <Route
              index
              element={<BaseForm pageTitle="Главная страница" menuItems={mainPageMenuItems}><MainForm /></BaseForm>}
            />
            <Route
              path="BaseForm"
              element={<BaseForm pageTitle="Base Form"></BaseForm>}
            />
            <Route
              path="ProductsForm"
              element={<BaseForm pageTitle="Товары"><ProductsForm /></BaseForm>}
            />
            <Route
              path="ProductsForm/edit/:id"
              element={<BaseForm pageTitle="Редактирование"><ProductEdit /></BaseForm>}
            />
            <Route
              path="settings"
              element={<BaseForm pageTitle="Настройки"><SettingsForm /></BaseForm>}
            />
          </Routes>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
