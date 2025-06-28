import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/common.css";
import "./MainPage.css";
import Button from "../ui/Button";

const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <div className="twa-container">
      <div className="twa-page">
        <h1 className="twa-title">Главная страница</h1>
        <div className="twa-content">
          <Button
            title="Гараж"
            variant="primary"
            fullWidth
            onClick={() => handleNavigation("CarList")}
          />
          <Button
            title="Товары"
            variant="primary"
            fullWidth
            onClick={() => handleNavigation("ProductsForm")}
          />
          <Button>
            <span>
              <h3>Строка 1</h3>
              <h4>Строка 2</h4>
            </span>
          </Button>
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
