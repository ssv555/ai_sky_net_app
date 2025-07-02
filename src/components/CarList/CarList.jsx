import React, { useState, useEffect, useMemo } from "react";
import "./CarList.css";
import apiCar from "../../services/apiCar";
import { useTelegram } from "../../hooks/useTelegram";
import FooterNav from "../ui/FooterNav";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { USER_ID } = useTelegram();

  useEffect(() => {
    const fetchCars = async () => {
      if (!USER_ID || USER_ID === 0) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data } = await apiCar.getCarList(USER_ID);
        setCars(data || []);
      } catch (error) {
        console.error("Ошибка при загрузке списка автомобилей:", error);
        setError("Не удалось загрузить список автомобилей");
        setCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, [USER_ID]);

  const memoizedCars = useMemo(() => {
    return cars.map((car) => ({
      ...car,
      displayName: `${car.brand_name} ${car.model_name} (${car.model_code}, ${car.year})`,
    }));
  }, [cars]);

  if (isLoading) {
    return (
      <div className="twa-container">
        <div className="twa-page">
          <h1 className="twa-title">Список автомобилей</h1>
          <div className="twa-content">
            <div className="twa-loading">Загрузка...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="twa-container">
        <div className="twa-page">
          <h1 className="twa-title">Список автомобилей</h1>
          <div className="twa-content">
            <div className="twa-error">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="twa-container">
      <div className="twa-page">
        <h1 className="twa-title">Список автомобилей</h1>
        <div className="twa-content">
          <div className="twa-list">
            {memoizedCars.map((car, index) => (
              <div
                key={car.id}
                className={`twa-list-item ${index % 2 === 0 ? "even" : "odd"}`}
              >
                <div className="twa-list-item-content">
                  <div className="twa-list-item-subtitle">
                    ID: {car.car_garage_id}
                  </div>
                  <div className="twa-list-item-title">{car.reg_number}</div>
                  <div className="twa-list-item-description">
                    {car.displayName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterNav />
    </div>
  );
};

export default CarList;
