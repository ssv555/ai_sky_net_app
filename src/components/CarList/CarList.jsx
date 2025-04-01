import React from "react";
import "./CarList.css";
import "../../styles/common.css";

const CarList = () => {
  return (
    <div className="twa-container">
      <div className="twa-page">
        <h1 className="twa-title">Список автомобилей</h1>
        <div className="twa-content">
          <div className="twa-list">
            {/* Здесь будет список автомобилей */}
            <div className="twa-list-item">
              <div className="twa-list-item-content">
                <div className="twa-list-item-title">A45 AMG</div>
                <div className="twa-list-item-subtitle">Mercedes-Benz</div>
              </div>
              <div className="twa-list-item-price">$50,000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarList;
