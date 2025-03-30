import "./App.css";
import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { Route, Routes, useLocation } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import CarList from "./components/CarList/CarList";
import CarForm from "./components/CarForm/CarForm";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  const { twa } = useTelegram();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname.replace(/^\//, "")) {
      case "":
        return "Главная страница";
      case "CarList":
        return "Список автомобилей";
      case "CarForm":
        return "Форма автомобиля";
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
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
