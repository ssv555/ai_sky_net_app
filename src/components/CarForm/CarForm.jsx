import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import "./CarForm.css";
import "../../styles/common.css";

const MAX_NAME_LENGTH = 255;
const MAX_PRICE = 1000000000;

const CarForm = () => {
  const [carName, setCarName] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carModel, setCarModel] = useState("0");
  const { tg, sendDataToServer } = useTelegram();

  const onSendData = useCallback(() => {
    if (!tg) {
      console.error("Telegram WebApp не инициализирован");
      return;
    }

    const trimmedName = carName.trim();
    if (!trimmedName) {
      tg.showAlert("Пожалуйста, введите название автомобиля");
      return;
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
      tg.showAlert(`Название не должно превышать ${MAX_NAME_LENGTH} символов`);
      return;
    }
    const price = Number(carPrice);
    if (!carPrice.trim() || isNaN(price)) {
      tg.showAlert("Пожалуйста, введите корректную цену");
      return;
    }
    if (price < 0) {
      tg.showAlert("Цена не может быть отрицательной");
      return;
    }
    if (price > MAX_PRICE) {
      tg.showAlert(`Цена не может превышать ${MAX_PRICE}`);
      return;
    }

    const data = {
      carName: trimmedName,
      carPrice: price,
      carModel: Number(carModel),
    };

    sendDataToServer(data);
  }, [tg, carName, carPrice, carModel, sendDataToServer]);

  useEffect(() => {
    if (!tg) return;
    tg.onEvent("mainButtonClicked", onSendData);
    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [tg, onSendData]);

  useEffect(() => {
    if (!tg?.MainButton) return;
    try {
      tg.MainButton.setParams({
        color: "#2481cc",
        text: "Сохранить",
      });
    } catch (error) {
      console.error("Ошибка при настройке MainButton:", error);
    }
  }, [tg]);

  useEffect(() => {
    if (!tg?.MainButton) return;
    try {
      const trimmedName = carName.trim();
      const price = Number(carPrice);
      const isValidPrice = !isNaN(price) && price >= 0 && price <= MAX_PRICE;

      if (trimmedName && isValidPrice && carModel !== "0") {
        tg.MainButton.show();
      } else {
        tg.MainButton.hide();
      }
    } catch (error) {
      console.error("Ошибка при управлении MainButton:", error);
    }
  }, [tg, carName, carPrice, carModel]);

  const changeCarName = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_NAME_LENGTH) {
      setCarName(value);
    }
  };

  const changeCarPrice = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCarPrice(value);
    }
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
                maxLength={MAX_NAME_LENGTH}
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
                pattern="[0-9]*"
                inputMode="numeric"
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
