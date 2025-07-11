import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import BasePage from "./components/ui/BasePage";
import ThemeSelector from "./components/ui/ThemeSelector";

import MainPage from "./components/MainPage/MainPage";
// import CarList from "./components/CarList/CarList";
// import CarForm from "./components/CarForm/CarForm";
import ProductsForm from "./components/Products/ProductsForm";
import ProductEdit from "./components/Products/ProductEdit";
import {
  initTelegramUtils,
  saveParamsFromUrlToStorage,
} from "./utils/telegramUtils";

function App() {
  const { WebApp, isTelegramEnvironment, twa } = useTelegram();
  const location = useLocation();

  // Инициализируем утилиты для работы с Telegram
  useEffect(() => {
    initTelegramUtils(WebApp, isTelegramEnvironment);
  }, [WebApp, isTelegramEnvironment]);

  // Сохраняем параметры из URL в localStorage при каждом монтировании/переходе
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
      <ErrorBoundary>
        <div className="App">
          <Routes>
                <Route
                  index
                  element={<MainPage />}
              errorElement={<ErrorBoundary pageTitle="Главная страница" />}
            />
            {/* <Route
              path="CarList"
              element={<CarList />}
              errorElement={<ErrorBoundary pageTitle="Список автомобилей" />}
            />
            <Route
              path="CarForm"
              element={<CarForm />}
              errorElement={<ErrorBoundary pageTitle="Форма автомобиля" />}
            /> */}
            <Route
              path="ProductsForm"
              element={<ProductsForm />}
              errorElement={<ErrorBoundary pageTitle="Товары" />}
            />
            <Route
              path="ProductsForm/edit/:id"
              element={<ProductsForm />}
              errorElement={<ErrorBoundary pageTitle="Редактирование" />}
            />
            <Route
              path="BasePage"
              element={
                <ThemeSelector />
              }
              errorElement={<ErrorBoundary pageTitle="Базовая страница" />}
            />
              </Routes>
            </div>
          </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
