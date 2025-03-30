import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import { WebApp } from "@twa-dev/sdk";
import "./CarForm.css";
import "../../styles/common.css";

const MAX_NAME_LENGTH = 255;
const MAX_PRICE = 1000000000;

const CarForm = () => {
  const [carName, setCarName] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carModel, setCarModel] = useState("0");
  const { sendDataToServer } = useTelegram();

  const onSendData = useCallback(() => {
    if (!WebApp) {
      console.error("Telegram WebApp не инициализирован");
      return;
    }
    /*
    const trimmedName = carName.trim();
    if (!trimmedName) {
      WebApp.showPopup({
        title: "Ошибка",
        message: "Пожалуйста, введите название автомобиля",
        buttons: [{ type: "ok" }],
      });
      return;
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
      WebApp.showPopup({
        title: "Ошибка",
        message: `Название не должно превышать ${MAX_NAME_LENGTH} символов`,
        buttons: [{ type: "ok" }],
      });
      return;
    }
    const price = Number(carPrice);
    if (!carPrice.trim() || isNaN(price)) {
      WebApp.showPopup({
        title: "Ошибка",
        message: "Пожалуйста, введите корректную цену",
        buttons: [{ type: "ok" }],
      });
      return;
    }
    if (price < 0) {
      WebApp.showPopup({
        title: "Ошибка",
        message: "Цена не может быть отрицательной",
        buttons: [{ type: "ok" }],
      });
      return;
    }
    if (price > MAX_PRICE) {
      WebApp.showPopup({
        title: "Ошибка",
        message: `Цена не может превышать ${MAX_PRICE}`,
        buttons: [{ type: "ok" }],
      });
      return;
    }
    */
    const data = {
      carName: trimmedName,
      carPrice: price,
      carModel: Number(carModel),
    };

    WebApp.showPopup({
      title: "data",
      message: JSON.stringify(data),
      buttons: [{ type: "ok" }],
    });

    sendDataToServer(data);
  }, [carName, carPrice, carModel, sendDataToServer]);

  useEffect(() => {
    WebApp.showPopup({
      title: "Отладочная информация",
      message: `carName: ${carName}\ncarPrice: ${carPrice}\ncarModel: ${carModel}`,
      buttons: [{ type: "ok" }],
    });

    WebApp.MainButton.setText("Сохранить");
    WebApp.MainButton.setBackgroundColor("#2481cc");
    WebApp.MainButton.onClick(onSendData);
    WebApp.MainButton.show();
    return () => {
      WebApp.MainButton.offClick(onSendData);
    };
  }, [onSendData, carName, carPrice, carModel]);

  useEffect(() => {
    if (!WebApp?.MainButton) {
      console.error("MainButton не доступен");
      return;
    }
    /*
    if (!twa) return;

    try {
      const trimmedName = carName.trim();
      const price = Number(carPrice);
      const isValidPrice = !isNaN(price) && price >= 0 && price <= MAX_PRICE;

      twa.showPopup({
        title: "Отладочная информация",
        message: `trimmedName: ${trimmedName}\nisValidPrice: ${isValidPrice}\ncarModel: ${carModel}`,
        buttons: [{ type: "ok" }],
      });

      if (trimmedName && isValidPrice && carModel !== "0") {
        console.log("Показ кнопки");
        twa.MainButton.setText("Сохранить");
        twa.MainButton.setBackgroundColor("#2481cc");
        twa.MainButton.show();
      } else {
        console.log("Скрытие кнопки");
        twa.MainButton.hide();
      }
    } catch (error) {
      console.error("Ошибка при управлении MainButton:", error);
    }
      */
  }, [twa, carName, carPrice, carModel]);

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
