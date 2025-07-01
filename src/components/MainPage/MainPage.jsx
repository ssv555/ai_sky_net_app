import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/common.css";
import "./MainPage.css";
import Button from "../ui/Button";
import { useTelegram } from "../../hooks/useTelegram";
import FooterNav from "../ui/FooterNav";

const MainPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useTelegram();

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleThemeDiagnostics = () => {
    let msg = "";
    const themeParams = window?.Telegram?.WebApp?.themeParams;
    if (themeParams) {
      msg += "themeParams: " + JSON.stringify(themeParams) + "\n";
    } else {
      msg += "themeParams: отсутствует\n";
    }
    const styles = getComputedStyle(document.documentElement);
    msg +=
      "--tg-theme-bg-color: " +
      styles.getPropertyValue("--tg-theme-bg-color") +
      "\n";
    msg +=
      "--tg-theme-button-color: " +
      styles.getPropertyValue("--tg-theme-button-color") +
      "\n";
    msg +=
      "--tg-theme-text-color: " +
      styles.getPropertyValue("--tg-theme-text-color") +
      "\n";
    showNotification(msg, "info");
  };

  useEffect(() => {
    if (window.Telegram?.WebApp?.ready) {
      window.Telegram.WebApp.ready();
    }
    if (window.Telegram?.WebApp?.expand) {
      window.Telegram.WebApp.expand();
    }
  }, []);

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
          <Button
            title="Диагностика темы"
            variant="secondary"
            fullWidth
            onClick={handleThemeDiagnostics}
          />
          {/* <Button>
            <span>
              <h3>Строка 1</h3>
              <h4>Строка 2</h4>
            </span>
          </Button> */}
        </div>
      </div>
      <FooterNav hideBack />
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
