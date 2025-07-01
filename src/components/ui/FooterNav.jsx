import React from "react";
import "./FooterNav.css";
import { useNavigate } from "react-router-dom";
import { useTelegram } from "../../hooks/useTelegram";

const FooterNav = ({ hideBack = false }) => {
  const navigate = useNavigate();
  const { tg } = useTelegram();

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    if (tg && tg.close) {
      tg.close();
    } else {
      window.close();
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
              onClick={handleBack}
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
