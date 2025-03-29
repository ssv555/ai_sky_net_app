import "./App.css";
import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/header/Header";
import MainPage from "./components/MainPage/MainPage";
import CarList from "./components/CarList/CarList";
import CarForm from "./components/CarForm/CarForm";

function App() {
  const { tg, setHeaderText } = useTelegram();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Главная страница";
      case "/CarList":
        return "Список автомобилей";
      case "/CarForm":
        return "Форма автомобиля";
      default:
        return "Main Page";
    }
  };

  useEffect(() => {
    if (tg) {
      tg.ready();
      try {
        setHeaderText("Hello world.");
      } catch (error) {
        console.log("error", error);
        tg.showPopup("error", error, "OK");
      }
    }
  }, [tg, setHeaderText]);

  return (
    <div className="App">
      <Header title={getPageTitle()} />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/CarList" element={<CarList />} />
        <Route path="/CarForm" element={<CarForm />} />
      </Routes>
    </div>
  );
}

export default App;
