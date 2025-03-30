import React from "react";
import { useState, useEffect } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import "./CarForm.css";
import "../../styles/common.css";

const CarForm = () => {
  const MAX_NAME_LENGTH = 255;
  const MAX_PRICE = 1000000000;

  const [carName, setCarName] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carModel, setCarModel] = useState("0");
  const { WebApp, MainButton } = useTelegram();

  // const onSendData = useCallback(() => {
  //   if (!WebApp) {
  //     console.error("Telegram WebApp не инициализирован");
  //     return;
  //   }
  //   /*
  //   const trimmedName = carName.trim();
  //   if (!trimmedName) {
  //     WebApp.showPopup({
  //       title: "Ошибка",
  //       message: "Пожалуйста, введите название автомобиля",
  //       buttons: [{ type: "ok" }],
  //     });
  //     return;
  //   }
  //   if (trimmedName.length > MAX_NAME_LENGTH) {
  //     WebApp.showPopup({
  //       title: "Ошибка",
  //       message: `Название не должно превышать ${MAX_NAME_LENGTH} символов`,
  //       buttons: [{ type: "ok" }],
  //     });
  //     return;
  //   }
  //   const price = Number(carPrice);
  //   if (!carPrice.trim() || isNaN(price)) {
  //     WebApp.showPopup({
  //       title: "Ошибка",
  //       message: "Пожалуйста, введите корректную цену",
  //       buttons: [{ type: "ok" }],
  //     });
  //     return;
  //   }
  //   if (price < 0) {
  //     WebApp.showPopup({
  //       title: "Ошибка",
  //       message: "Цена не может быть отрицательной",
  //       buttons: [{ type: "ok" }],
  //     });
  //     return;
  //   }
  //   if (price > MAX_PRICE) {
  //     WebApp.showPopup({
  //       title: "Ошибка",
  //       message: `Цена не может превышать ${MAX_PRICE}`,
  //       buttons: [{ type: "ok" }],
  //     });
  //     return;
  //   }
  //   */
  //   const data = {
  //     carName: trimmedName,
  //     carPrice: price,
  //     carModel: Number(carModel),
  //   };

  //   // WebApp.showPopup({
  //   //   title: "data",
  //   //   message: JSON.stringify(data),
  //   //   buttons: [{ type: "ok" }],
  //   // });
  //   sendDataToServer(data);
  // }, [carName, carPrice, carModel, sendDataToServer]);

  // useEffect(() => {
  //   MainButton.setText("Сохранить");
  //   MainButton.color = "#2481cc";
  //   MainButton.show();
  //   return () => {
  //     MainButton.offClick(onSendData);
  //   };
  // }, [carName, carPrice, carModel]); // TODO: добавить onSendData

  // Отображение кнопки Сохранить.
  useEffect(() => {
    if (!WebApp) return;
    try {
      const price = Number(carPrice);
      const isValidPrice = !isNaN(price) && price >= 0 && price <= MAX_PRICE;

      if (carName && isValidPrice && carModel) {
        MainButton.setText("Сохранить");
        // MainButton.oтClick(onSendData);
        // return () => {
        //   MainButton.offClick(onSendData);
        // };
        MainButton.show();
      } else {
        MainButton.hide();
      }
    } catch (error) {
      MainButton.hide();
    }
  }, [WebApp, MainButton, carName, carPrice, carModel]);

  const changeCarName = (e) => {
    const value = e.target.value.trim();
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

/*
      WebApp.showPopup({
        title: "Ошибка",
        message: `Ошибка: ${error.message}`,
        buttons: [{ type: "ok" }],
      });
*/
