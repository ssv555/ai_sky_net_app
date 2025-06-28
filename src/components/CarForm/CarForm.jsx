import "../../styles/common.css";
import "./CarForm.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import apiCar from "../../services/apiCar";
import {
  setAmg45Model,
  isAmg45Group,
  handleModelSelection,
  handleEnginePower,
  setMercedesBrand,
} from "../../groups/amg45";
import { useAmg45Logic } from "./CarForm.amg45";

const MAX_NAME_LENGTH = 256;
const MAX_PRICE = 1000000000;

const CarForm = () => {
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () =>
      Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i),
    [currentYear]
  );

  const fuelTypes = useMemo(
    () => ["Бензин", "Дизель", "Гибрид", "Электрический", "Газ"],
    []
  );

  const transmissionTypes = useMemo(
    () => ["Не установлено", "КПП", "АКПП", "Робот", "Вариатор"],
    []
  );

  const {
    WebApp,
    MainButton,
    user,
    sendDataToServer,
    isDevMode,
    CHAT_ID,
    BOT_USERNAME,
    showNotification,
  } = useTelegram();

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
  const [models, setModels] = useState([
    { car_model_id: "", model_code: "", model_name: "", tuning: "" },
  ]);

  const updateCarData = useCallback((updates) => {
    setCarData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // ЗАГРУЗКА МОДЕЛЕЙ ПРИ ИЗМЕНЕНИИ БРЕНДА
  useEffect(() => {
    const fetchModels = async () => {
      if (!carData.car_brand_id) {
        setModels([
          { car_model_id: "", model_code: "", model_name: "", tuning: "" },
        ]);
        return;
      }
      try {
        setModels([]);
        const response = await apiCar.getModels(carData.car_brand_id);
        const filteredModels = response.data.filter(
          (model) => model.model_name && model.model_name.trim() !== ""
        );
        setModels(filteredModels);
      } catch (error) {
        console.error("Ошибка при загрузке моделей:", error);
        setModels([]);
      }
    };

    fetchModels();
  }, [carData.car_brand_id]);

  // ЗАГРУЗКА БРЕНДОВ
  useEffect(() => {
    const fetchBrands = async () => {
      if (brands.length > 1) return;
      try {
        setBrands([]);
        const response = await apiCar.getBrands();
        const filteredBrands = response.data.filter(
          (brand) => brand.brand_name && brand.brand_name.trim() !== ""
        );
        setBrands(filteredBrands);
      } catch (error) {
        console.error("Ошибка при загрузке брендов:", error);
        setBrands([]);
      }
    };

    fetchBrands();
  }, [brands]);

  // region Работа с клубом AMG 45 RUS
  useAmg45Logic({
    brands,
    models,
    carData,
    setCarData: updateCarData,
    CHAT_ID,
    BOT_USERNAME,
  });
  // endregion

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
    if (!carData.car_brand_id) {
      message = "Пожалуйста, выберите бренд";
    } else if (!carData.car_model_id) {
      message = "Пожалуйста, выберите модель";
    } else if (!carData.year) {
      message = "Пожалуйста, выберите год выпуска";
    } else if (!carData.vin) {
      message = "Пожалуйста, введите VIN код";
    } else if (!carData.reg_number) {
      message = "Пожалуйста, введите регистрационный номер";
    }

    if (message) {
      showNotification(message, "error");
      return false;
    }

    return true;
  }, [WebApp, carData, showNotification]);

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
      const areRequiredFieldsFilled =
        carData.car_brand_id &&
        carData.car_model_id &&
        carData.year &&
        carData.vin &&
        carData.reg_number;

      addFooterDebugInfo(`
        carData: ${JSON.stringify(carData, null, 2)}
      `);

      if (areRequiredFieldsFilled) {
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
  }, [WebApp, MainButton, carData, onSendData, addFooterDebugInfo]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      updateCarData({ [name]: value });
    },
    [updateCarData]
  );

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
                    {brand.brand_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="twa-form-group">
              <label
                className="twa-form-label-required"
                title="обязательно для заполнения"
              >
                Модель
              </label>
              <select
                className="twa-select"
                name="car_model_id"
                value={carData.car_model_id}
                onChange={handleInputChange}
              >
                <option value="">Выберите модель</option>
                {models.map((model) => (
                  <option key={model.car_model_id} value={model.car_model_id}>
                    {`${model.model_code}. ${model.model_name} ${
                      model.tuning ? ", " + model.tuning : ""
                    }`}
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
                maxLength={MAX_NAME_LENGTH}
              />
            </div>
            <div className="twa-form-group">
              <label
                className="twa-form-label-required"
                title="обязательно для заполнения"
              >
                Регистрационный номер
              </label>
              <input
                className="twa-input"
                type="text"
                name="reg_number"
                placeholder="Введите регистрационный номер"
                value={carData.reg_number}
                onChange={handleInputChange}
                maxLength={MAX_NAME_LENGTH}
                required
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
              <select
                className="twa-select"
                name="transmission"
                value={carData.transmission}
                onChange={handleInputChange}
              >
                {transmissionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
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
