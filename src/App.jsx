import "./App.css";
import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import MainPage from "./components/MainPage/MainPage";
import CarList from "./components/CarList/CarList";
import CarForm from "./components/CarForm/CarForm";
import ProductsForm from "./components/Products/ProductsForm";
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

  const getPageTitle = () => {
    switch (location.pathname.replace(/^\//, "")) {
      case "":
        return "Главная страница";
      case "CarList":
        return "Список автомобилей";
      case "CarForm":
        return "Форма автомобиля";
      case "ProductsForm":
        return "Товары";
      default:
        return "Main Page";
    }
  };

  useEffect(() => {
    if (twa) {
      twa.expand();
    }
  }, [twa]);

  return (
    <ErrorBoundary>
      <div className="App">
        <Routes>
          <Route
            index
            element={<MainPage />}
            errorElement={<ErrorBoundary pageTitle="Главная страница" />}
          />
          <Route
            path="CarList"
            element={<CarList />}
            errorElement={<ErrorBoundary pageTitle="Список автомобилей" />}
          />
          <Route
            path="CarForm"
            element={<CarForm />}
            errorElement={<ErrorBoundary pageTitle="Форма автомобиля" />}
          />
          <Route
            path="ProductsForm"
            element={<ProductsForm />}
            errorElement={<ErrorBoundary pageTitle="Товары" />}
          />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
