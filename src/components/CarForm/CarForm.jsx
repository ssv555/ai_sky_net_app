import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import "../../styles/common.css";
import "./CarForm.css";

const MAX_NAME_LENGTH = 256;
const MAX_PRICE = 1000000000;

const CarForm = () => {
  const [carName, setCarName] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carModel, setCarModel] = useState("0");
  const { WebApp, MainButton, sendDataToServer, isDevMode } = useTelegram();

  const addFooterDebugInfo = useCallback(
    (text, append = false) => {
      if (!isDevMode()) return;

      const debugElement = document.querySelector(".twa-footer-debug");
      if (!debugElement) return;

      if (append) {
        const currentContent = debugElement.innerHTML;
        debugElement.innerHTML = currentContent + text;
      } else {
        debugElement.innerHTML = text;
      }
    },
    [isDevMode]
  );

  const validateForm = useCallback(() => {
    let message;

    if (!carName) {
      message = "Пожалуйста, введите название автомобиля";
    }
    if (carName.length > MAX_NAME_LENGTH) {
      message = `Название не должно превышать ${MAX_NAME_LENGTH} символов`;
    }
    const price = Number(carPrice);
    if (!carPrice.trim() || isNaN(price)) {
      message = "Пожалуйста, введите корректную цену";
    }
    if (price < 0) {
      message = "Цена не может быть отрицательной";
    }
    if (price > MAX_PRICE) {
      message = `Цена не может превышать ${MAX_PRICE}`;
    }

    if (message) {
      WebApp.showPopup({
        title: "Ошибка",
        message: message,
        buttons: [{ type: "ok" }],
      });
      return false;
    }

    return true;
  }, [WebApp, carName, carPrice]);

  // Вызов функции отправки данных на сервер.
  const onSendData = useCallback(() => {
    if (!WebApp) return;
    if (!validateForm()) {
      return;
    }

    const data = {
      carName: carName,
      carPrice: Number(carPrice),
      carModel: Number(carModel),
    };

    sendDataToServer(data);
  }, [WebApp, carName, carPrice, carModel, sendDataToServer, validateForm]);

  // Отображение кнопки Сохранить.
  useEffect(() => {
    if (!WebApp) return;
    try {
      const price = Number(carPrice);
      const isValidPrice = !isNaN(price) && price > 0;

      addFooterDebugInfo(
        `
        carName: ${carName || "не задано"}<br/>
        carPrice: ${carPrice || "0"}<br/> 
        carModel: ${carModel || "не выбрана"}<br/>
        isValidPrice: ${isValidPrice ? "true" : "false"}`
      );

      if (carName && isValidPrice && carModel) {
        addFooterDebugInfo("<br>Мы внутри.", true);
        MainButton.setText("Сохранить");
        MainButton.onClick(onSendData);
        MainButton.show();
        return () => {
          MainButton.offClick(onSendData);
        };
      } else {
        MainButton.hide();
      }
    } catch (error) {
      MainButton.hide();
    }
  }, [WebApp, MainButton, carName, carPrice, carModel]);

  const changeCarName = (e) => {
    const value = e.target.value.trim();
    if (value.length > 0) {
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
        <h1 className="twa-title">Автомобиль</h1>
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
        <div className="twa-footer-debug"></div>
      </div>
    </div>
  );
};

export default CarForm;

/*
      WebApp.showPopup({
        title: "Ошибка",
        message: `Ошибка: ${error.message}`,
        buttons: [{ type: "ok" }],
      });
*/
