import "../../styles/common.css";
import "./CarForm.css";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import apiCar from "../../services/apiCar";

const MAX_NAME_LENGTH = 256;
const MAX_PRICE = 1000000000;

const CarForm = () => {
  const { WebApp, MainButton, sendDataToServer, isDevMode } = useTelegram();
  const { user } = useTelegram();
  const [carData, setCarData] = useState({
    car_garage_id: "",
    tg_user_id: user?.id,
    car_brand_id: "",
    car_model_id: "",
    reg_number: "",
    vin: "",
    year: new Date().getFullYear(),
    engine_size: 0,
    horsepower: 0,
    buy_price: 0,
    buy_mileage: 0,
    transmission: "",
    fuel_type: "",
    datetime_sell: "",
    tg_photos: "",
    settings: "",
    datetime_ins: "",
  });

  const [brands, setBrands] = useState([{ car_brand_id: "", name: "" }]);

  useEffect(() => {
    const fetchBrands = async () => {
      if (brands.length > 1) return;
      try {
        setBrands([]);
        const response = await apiCar.getBrands();
        const filteredBrands = response.data.filter(
          (brand) => brand.name && brand.name.trim() !== ""
        );
        setBrands(filteredBrands);

        // Находим Mercedes-Benz и устанавливаем его как выбранный
        const mercedes = filteredBrands.find(
          (brand) => brand.name === "Mercedes-Benz"
        );
        if (mercedes) {
          setCarData((prev) => ({
            ...prev,
            car_brand_id: mercedes.car_brand_id,
          }));
        }
      } catch (error) {
        console.error("Ошибка при загрузке брендов:", error);
        setBrands([]);
      }
    };

    fetchBrands();
  }, [brands]);

  const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 2025 - i);
  const fuelTypes = ["Бензин", "Дизель", "Гибрид", "Электрический", "Газ"];

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

    if (!carData.reg_number) {
      message = "Пожалуйста, введите регистрационный номер";
    }
    if (!carData.vin) {
      message = "Пожалуйста, введите VIN код";
    }
    if (!carData.year) {
      message = "Пожалуйста, выберите год выпуска";
    }
    if (!carData.engine_size) {
      message = "Пожалуйста, введите объем двигателя";
    }
    if (!carData.horsepower) {
      message = "Пожалуйста, введите мощность двигателя";
    }
    if (!carData.buy_price) {
      message = "Пожалуйста, введите цену";
    }
    if (!carData.buy_mileage) {
      message = "Пожалуйста, введите пробег";
    }
    if (!carData.transmission) {
      message = "Пожалуйста, введите тип трансмиссии";
    }
    if (!carData.fuel_type) {
      message = "Пожалуйста, выберите тип топлива";
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
  }, [WebApp, carData]);

  const onSendData = useCallback(() => {
    if (!WebApp) return;
    if (!validateForm()) {
      return;
    }

    sendDataToServer(carData);
  }, [WebApp, carData, sendDataToServer, validateForm]);

  useEffect(() => {
    if (!WebApp) return;
    try {
      const isValid = Object.values(carData).some(
        (value) => value !== null && value !== ""
      );

      addFooterDebugInfo(`
        carData: ${JSON.stringify(carData, null, 2)}
      `);

      if (isValid) {
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
  }, [WebApp, MainButton, carData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="twa-container">
      <div className="twa-page">
        <h1 className="twa-title">Автомобиль</h1>
        <div className="twa-content">
          <div className="twa-form">
            <div className="twa-form-group">
              <label
                className="twa-form-label-required"
                title="обязательно для заполнения"
              >
                Бренд
              </label>
              <select
                className="twa-select"
                name="car_brand_id"
                value={carData.car_brand_id}
                onChange={handleInputChange}
              >
                <option value="">Выберите бренд</option>
                {brands.map((brand) => (
                  <option key={brand.car_brand_id} value={brand.car_brand_id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="twa-form-group">
              <label
                className="twa-form-label-required"
                title="обязательно для заполнения"
              >
                Год выпуска
              </label>
              <select
                className="twa-select"
                name="year"
                value={carData.year}
                onChange={handleInputChange}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="twa-form-group">
              <label
                className="twa-form-label-required"
                title="обязательно для заполнения"
              >
                VIN код
              </label>
              <input
                className="twa-input"
                type="text"
                name="vin"
                placeholder="Введите VIN код"
                value={carData.vin}
                onChange={handleInputChange}
                maxLength={255}
              />
            </div>
            <div className="twa-form-group">
              <label className="twa-form-label">Регистрационный номер</label>
              <input
                className="twa-input"
                type="text"
                name="reg_number"
                placeholder="Введите регистрационный номер"
                value={carData.reg_number}
                onChange={handleInputChange}
                maxLength={30}
              />
            </div>
            <div className="twa-form-group">
              <label className="twa-form-label">Объем двигателя (л)</label>
              <input
                className="twa-input"
                type="number"
                name="engine_size"
                placeholder="Введите объем двигателя"
                value={carData.engine_size}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="20"
              />
            </div>
            <div className="twa-form-group">
              <label className="twa-form-label">Мощность (л.с.)</label>
              <input
                className="twa-input"
                type="number"
                name="horsepower"
                placeholder="Введите мощность двигателя"
                value={carData.horsepower}
                onChange={handleInputChange}
                min="0"
                max="2000"
              />
            </div>
            <div className="twa-form-group">
              <label className="twa-form-label">Цена покупки</label>
              <input
                className="twa-input"
                type="number"
                name="buy_price"
                placeholder="Введите цену покупки"
                value={carData.buy_price}
                onChange={handleInputChange}
                min="0"
                max={MAX_PRICE}
              />
            </div>
            <div className="twa-form-group">
              <label className="twa-form-label">Пробег (км)</label>
              <input
                className="twa-input"
                type="number"
                name="buy_mileage"
                placeholder="Введите пробег"
                value={carData.buy_mileage}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div className="twa-form-group">
              <label className="twa-form-label">Трансмиссия</label>
              <input
                className="twa-input"
                type="text"
                name="transmission"
                placeholder="Введите тип трансмиссии"
                value={carData.transmission}
                onChange={handleInputChange}
                maxLength={30}
              />
            </div>
            <div className="twa-form-group">
              <label className="twa-form-label">Тип топлива</label>
              <select
                className="twa-select"
                name="fuel_type"
                value={carData.fuel_type}
                onChange={handleInputChange}
              >
                <option value="">Выберите тип топлива</option>
                {fuelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="twa-form-group">
              <label className="twa-form-label">Дата продажи</label>
              <input
                className="twa-input"
                type="datetime-local"
                name="datetime_sell"
                value={carData.datetime_sell}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="twa-footer-debug"></div>
      </div>
    </div>
  );
};

export default CarForm;
