import "./App.css";
import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";

import CarList from "./components/CarList/CarList";
import CarForm from "./components/CarForm/CarForm";

function App() {
  const { tg } = useTelegram();

  useEffect(() => {
    if (tg) {
      tg.ready();
    }
  }, [tg]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/CarList" element={<CarList />} />
        <Route path="/CarForm" element={<CarForm />} />
      </Routes>
    </div>
  );
}

export default App;

// <Button onClick={onToggleButton}>Toggle</Button>
