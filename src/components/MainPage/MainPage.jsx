import React from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="twa-container">
      <div className="twa-page">
        <div className="twa-header">
          <h1 className="twa-title">Some text of main page</h1>
        </div>
        <div className="twa-content">
          <button
            className="twa-button twa-button-primary"
            onClick={() => navigate("/CarList")}
          >
            Car list
          </button>
          <button
            className="twa-button twa-button-primary"
            onClick={() => navigate("/CarForm")}
          >
            Car
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
