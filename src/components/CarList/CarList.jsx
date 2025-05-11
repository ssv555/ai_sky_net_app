import React, { useState, useEffect } from "react";
import "./CarList.css";
import "../../styles/common.css";
import apiCar from "../../services/apiCar";
import { useTelegram } from "../../hooks/useTelegram";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const { USER_ID } = useTelegram();

  useEffect(() => {
    if (USER_ID && USER_ID !== 0) {
      apiCar.getCarList(USER_ID).then((data) => {
        // setCars(data);
        // console.log("setCars:", data);
        try {
          setCars([]);
          const carlist = data.data;
          setCars(carlist);
        } catch (error) {
          console.error("Ошибка при загрузке списка автомобилей:", error);
          setCars([]);
        }
      });
    }
  }, [USER_ID]);

  return (
    <div className="twa-container">
      <div className="twa-page">
        <h1 className="twa-title">Список автомобилей</h1>
        <div className="twa-content">
          <div className="twa-list">
            {cars.map((car, index) => (
              <div
                key={car.id}
                className={`twa-list-item ${index % 2 === 0 ? "even" : "odd"}`}
              >
                <div className="twa-list-item-content">
                  <div className="twa-list-item-subtitle">{car.garage_id}</div>
                  <div className="twa-list-item-title">{car.reg_number}</div>
                  <div className="twa-list-item-description">{`${car.brand_name} ${car.model_name} (${car.model_code}, ${car.year})`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarList;
