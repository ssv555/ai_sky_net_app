import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import "./CarForm.css";
import "../../styles/common.css";

const CarForm = () => {
  const [carName, setCarName] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carModel, setCarModel] = useState("0");
  const { tg } = useTelegram();

  const onSendData = useCallback(() => {
    // Проверяем наличие tg
    if (!tg) {
      console.error("Telegram WebApp не инициализирован");
      return;
    }

    if (!carName.trim()) {
      tg.showAlert("Пожалуйста, введите название автомобиля");
      return;
    }

    if (!carPrice.trim() || isNaN(Number(carPrice))) {
      tg.showAlert("Пожалуйста, введите корректную цену");
      return;
    }

    const data = {
      carName: carName.trim(),
      carPrice: Number(carPrice),
      carModel: Number(carModel),
    };

    try {
      const botUsername = "ssv_test_bot";
      const params = new URLSearchParams(data);
      const callbackData = `car_data:${params.toString()}`;
      const encodedCallbackData = encodeURIComponent(callbackData);
      const url = `https://t.me/${botUsername}?start=${encodedCallbackData}`;
      tg.showAlert(`url: ${url}`);

      // Отправляем сообщение через URL
      window.location.href = url;
      tg.showAlert(`window.location.href: ${window.location.href}`);
    } catch (error) {
      tg.showAlert(error);
    }

    tg.showAlert(`2. data: ${JSON.stringify(data)}`);
  }, [tg, carName, carPrice, carModel]); // , sendData

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onSendData);
    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [tg, onSendData]);

  useEffect(() => {
    if (tg?.MainButton) {
      tg.MainButton.setParams({
        color: "#2481cc",
        text: "Сохранить",
      });
    }
  }, [tg]);

  useEffect(() => {
    if (tg?.MainButton) {
      if (carName && carPrice && carModel) {
        tg.MainButton.show();
      } else {
        tg.MainButton.hide();
      }
    }
  }, [tg, carName, carPrice, carModel]);

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
