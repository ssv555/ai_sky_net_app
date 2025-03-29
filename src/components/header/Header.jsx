import React from "react";
import { useTelegram } from "../../hooks/useTelegram";
import "../../styles/common.css";
import "./Header.css";

const Header = ({ title = "Main Page" }) => {
  const { onClose } = useTelegram();

  return (
    <div className="twa-header">
      <div className="twa-header-content">
        <div className="twa-header-left">
          <h1 className="twa-title">{title}</h1>
        </div>
        <button onClick={onClose} className="twa-button twa-button-secondary">
          ✕
        </button>
      </div>
    </div>
  );
};

export default Header;
// <span className="twa-username">{user?.username}</span>
