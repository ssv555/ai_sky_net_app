import React from "react";
import "./CarForm.css";
import Button from "../button/Button";
import { useState, useEffect } from "react";
import { useTelegram } from "../../hooks/useTelegram";

const CarForm = () => {
  const [carName, setCarName] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carModel, setCarModel] = useState("physical");
  const { tg } = useTelegram();

  useEffect(() => {
    tg.MainButton.setParams({
      color: "#000000",
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
    <div className="form">
      <h3>Форма автомобиля</h3>
      <input
        className="input"
        type="text"
        placeholder="Название автомобиля"
        value={carName}
        onChange={changeCarName}
      />
      <input
        className="input"
        type="text"
        placeholder="Цена автомобиля"
        value={carPrice}
        onChange={changeCarPrice}
      />
      <select className="select" value={carModel} onChange={changeCarModel}>
        <option value="0">Не указано - Модель</option>
        <option value="1">A45</option>
        <option value="2">CLA45</option>
        <option value="3">GLA45</option>
      </select>
    </div>
  );
};

export default CarForm;
