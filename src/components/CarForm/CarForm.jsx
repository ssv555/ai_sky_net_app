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
      tg.showPopup({
        title: "Ошибка",
        message: "Пожалуйста, введите название автомобиля",
        buttons: [{ type: "ok" }],
      });
      return;
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
      tg.showPopup({
        title: "Ошибка",
        message: `Название не должно превышать ${MAX_NAME_LENGTH} символов`,
        buttons: [{ type: "ok" }],
      });
      return;
    }
    const price = Number(carPrice);
    if (!carPrice.trim() || isNaN(price)) {
      tg.showPopup({
        title: "Ошибка",
        message: "Пожалуйста, введите корректную цену",
        buttons: [{ type: "ok" }],
      });
      return;
    }
    if (price < 0) {
      tg.showPopup({
        title: "Ошибка",
        message: "Цена не может быть отрицательной",
        buttons: [{ type: "ok" }],
      });
      return;
    }
    if (price > MAX_PRICE) {
      tg.showPopup({
        title: "Ошибка",
        message: `Цена не может превышать ${MAX_PRICE}`,
        buttons: [{ type: "ok" }],
      });
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

    tg.MainButton.onClick(onSendData);
    return () => {
      tg.MainButton.offClick(onSendData);
    };
  }, [tg, onSendData]);

  useEffect(() => {
    if (!tg) return;

    try {
      console.log("Установка параметров MainButton");
      tg.MainButton.setParams({
        color: "#2481cc",
        text: "Сохранить",
      });
    } catch (error) {
      console.error("Ошибка при настройке MainButton:", error);
    }
  }, [tg]);

  useEffect(() => {
    if (!tg) return;

    try {
      const trimmedName = carName.trim();
      const price = Number(carPrice);
      const isValidPrice = !isNaN(price) && price >= 0 && price <= MAX_PRICE;

      console.log("Проверка условий для кнопки:", {
        hasName: !!trimmedName,
        isValidPrice,
        carModel,
      });

      if (trimmedName && isValidPrice && carModel !== "0") {
        console.log("Показ кнопки");
        tg.MainButton.show();
      } else {
        console.log("Скрытие кнопки");
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
