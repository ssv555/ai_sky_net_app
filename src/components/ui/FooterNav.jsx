import React from "react";
import "./FooterNav.css";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../../hooks/useTelegram";

const FooterNav = ({ hideBack = false, backRoute = "/" }) => {
  const navigate = useNavigate();
  const { tg } = useTelegram();

  const handleBack = (route = backRoute) => {
    navigate(route);
  };

  const handleClose = () => {
    // TODO: не работает в телеграме, поэтому используем handleBack()
    // showNotification(`tg: ${tg}`, "info");
    // showNotification(`tg.close: ${tg && tg.close}`, "info");

    if (tg && tg.close) {
      tg.close();
    } else {
      handleBack();
    }
  };

  return (
    <footer className="footer-nav">
      <div
        className={`footer-nav__container ${
          hideBack ? "footer-nav__container--single-button" : ""
        }`}
      >
        <div className="footer-nav__left">
          {!hideBack && (
            <button
              className="footer-nav__btn footer-nav__btn--secondary"
              onClick={() => handleBack()}
            >
              Назад
            </button>
          )}
        </div>
        <div className="footer-nav__right">
          <button
            className="footer-nav__btn footer-nav__btn--secondary footer-nav__btn--close"
            onClick={handleClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterNav;
