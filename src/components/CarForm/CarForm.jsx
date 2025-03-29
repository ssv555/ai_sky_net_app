import React from "react";
import "./CarForm.css";
import { useState, useEffect } from "react";
import { useTelegram } from "../../hooks/useTelegram";

const CarForm = () => {
  const [carName, setCarName] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carModel, setCarModel] = useState("0");
  const { tg } = useTelegram();

  useEffect(() => {
    tg.MainButton.setParams({
      color: "#2481cc",
      text: "Сохранить",
    });
  }, []);

  useEffect(() => {
    if (carName && carPrice && carModel) {
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  }, [carName, carPrice, carModel]);

  useEffect(() => {
    tg.MainButton.onClick(() => {
      // Здесь будет логика сохранения
      const carData = {
        name: carName,
        price: carPrice,
        model: carModel,
      };
      console.log("Saving car data:", carData);
      // TODO: Добавить отправку данных на сервер
    });
  }, [carName, carPrice, carModel]);

  const changeCarName = (e) => {
    setCarName(e.target.value);
  };
  const changeCarPrice = (e) => {
    setCarPrice(e.target.value);
  };
  const changeCarModel = (e) => {
    setCarModel(e.target.value);
  };

  return (
    <div className="twa-container">
      <div className="twa-page">
        <div className="twa-header">
          <h1 className="twa-title">Форма автомобиля</h1>
        </div>
        <div className="twa-content">
          <div className="twa-form">
            <div className="twa-form-group">
              <label className="twa-form-label">Название автомобиля</label>
              <input
                className="twa-input"
                type="text"
                placeholder="Введите название"
                value={carName}
                onChange={changeCarName}
              />
            </div>
            <div className="twa-form-group">
              <label className="twa-form-label">Цена автомобиля</label>
              <input
                className="twa-input"
                type="text"
                placeholder="Введите цену"
                value={carPrice}
                onChange={changeCarPrice}
              />
            </div>
            <div className="twa-form-group">
              <label className="twa-form-label">Модель</label>
              <select
                className="twa-select"
                value={carModel}
                onChange={changeCarModel}
              >
                <option value="0">Не указано</option>
                <option value="1">A45</option>
                <option value="2">CLA45</option>
                <option value="3">GLA45</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarForm;
