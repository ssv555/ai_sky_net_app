import React from "react";
import { useTelegram } from "../../hooks/useTelegram";
import "./Header.css";

const Header = ({ title = "Main Page" }) => {
  const { user, onClose } = useTelegram();

  return (
    <div className="twa-header">
      <div className="twa-header-content">
        <div className="twa-header-left">
          <h1 className="twa-title">{title}</h1>
          <span className="twa-username">{user?.username}</span>
        </div>
        <button onClick={onClose} className="twa-button twa-button-secondary">
          ✕
        </button>
      </div>
    </div>
  );
};

export default Header;
