import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/common.css";
import "./MainPage.css";

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
        <h1 className="twa-title">Some text of main page</h1>
        <div className="twa-content">
          <button
            className="twa-button twa-button-primary"
            onClick={() => handleNavigation("CarList")}
          >
            Car list
          </button>
          <button
            className="twa-button twa-button-primary"
            onClick={() => handleNavigation("CarForm")}
          >
            Car
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
