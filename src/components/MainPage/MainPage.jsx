import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useTelegram } from "../../hooks/useTelegram";

const MainPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useTelegram();

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (error) {
      showNotification(`Ошибка навигации: ${error.message}`, "error");
    }
  };

  return (
    <div className="twa-container">
      <div className="twa-page">
        <h1 className="twa-title">Главная страница</h1>
        <div className="twa-content">
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleNavigation("/ProductsForm")}
          >
            Товары
          </Button>

          {/*
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleNavigation("/CarList")}
          >
            Список автомобилей
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleNavigation("/CarForm")}
          >
            Добавить автомобиль
          </Button>

          <Button>
            <span>
              <h3>Строка 1</h3>
              <h4>Строка 2</h4>
            </span>
          </Button>
          */}
        </div>
      </div>
    </div>
  );
};

export default MainPage;

/*
          <Button
            title="Car list"
            variant="primary"
            fullWidth
            onClick={() => handleNavigation("CarList")}
          />
          <Button
            title="Car"
            variant="primary"
            fullWidth
            onClick={() => handleNavigation("CarForm")}
          />
*/
