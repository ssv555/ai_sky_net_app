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

  // const onSendData = useCallback(() => {
  //   const data = { carName, carPrice, carModel };
  //   // sendData(data);
  // }, [carName, carPrice, carModel]); // , sendData

  // useEffect(() => {
  //   tg.onEvent("mainButtonClicked", onSendData);
  //   return () => {
  //     tg.offEvent("mainButtonClicked", onSendData);
  //   };
  // }, [tg, onSendData]);

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
        tg.showAlert(
          `carName: ${carName}, carPrice: ${carPrice}, carModel: ${carModel}`
        );
      } else {
        tg.MainButton.hide();
      }
    }
  }, [carName, carPrice, carModel, tg]);

  useEffect(() => {
    if (tg?.MainButton) {
      tg.MainButton.onClick(() => {
        const data = {
          name: carName,
          price: carPrice,
          model: carModel,
        };

        console.log("carName:", carName);
        console.log("carPrice:", carPrice);
        console.log("carModel:", carModel);
        console.log("Объект data:", data);
        console.log("JSON строка:", JSON.stringify(data));

        tg.showAlert(`data: ${JSON.stringify(data)}`);

        // Показываем диалог подтверждения
        if (tg.showConfirm) {
          tg.showConfirm(
            `Вы хотите сохранить автомобиль "${JSON.stringify(data)}"?`,
            (confirmed) => {
              if (confirmed && tg.showAlert) {
                try {
                  tg.sendData(JSON.stringify(data));
                  tg.showAlert("Автомобиль успешно сохранен!");
                } catch (error) {
                  console.log(error);
                  tg.showAlert(error);
                }
              }
            }
          );
        }
      });
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
