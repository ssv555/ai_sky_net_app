import React from "react";
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
    <div>
      <Button
        variant="contained"
        fullWidth
        onClick={() => handleNavigation("/ProductsForm")}
      >
        Товары
      </Button>
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
