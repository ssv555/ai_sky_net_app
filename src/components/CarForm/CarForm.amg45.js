import { useEffect } from "react";
import {
  setAmg45Model,
  isAmg45Group,
  handleModelSelection,
  handleEnginePower,
  setMercedesBrand,
} from "../../groups/amg45";

export function useAmg45Logic({
  brands,
  models,
  carData,
  setCarData,
  CHAT_ID,
  BOT_USERNAME,
}) {
  // Установка бренда
  useEffect(() => {
    if (isAmg45Group(CHAT_ID, BOT_USERNAME) && brands.length > 1) {
      setMercedesBrand(brands, setCarData);
    }
  }, [CHAT_ID, BOT_USERNAME, brands]);

  // Установка модели и мощности двигателя
  useEffect(() => {
    if (isAmg45Group(CHAT_ID, BOT_USERNAME) && models.length > 1) {
      const model = models.find((m) => m.car_model_id === carData.car_model_id);
      if (model) {
        setCarData((prev) => ({
          ...prev,
          model: model.name,
          year: 2013,
          enginePower: handleEnginePower(model, 2013),
        }));
      }
    }
  }, [CHAT_ID, BOT_USERNAME, carData.car_model_id, models, setCarData]);
}

/*
export function useAmg45Logic({
  brands,
  models,
  carData,
  setCarData,
  CHAT_ID,
  BOT_USERNAME,
}) {
  // Установка бренда
  useEffect(() => {
    if (isAmg45Group(CHAT_ID, BOT_USERNAME)) {
      if (brands.length > 1) {
        setMercedesBrand(brands, setCarData);
      }
    }
  }, [CHAT_ID, BOT_USERNAME, brands]);

  // Установка модели
  useEffect(() => {
    if (isAmg45Group(CHAT_ID, BOT_USERNAME)) {
      if (models.length > 1) {
        setAmg45Model(models, setCarData);
        setCarData((prev) => ({ ...prev, year: 2013 }));
      }
    }
  }, [CHAT_ID, BOT_USERNAME, models]);

  // Установка лс
  useEffect(() => {
    if (isAmg45Group(CHAT_ID, BOT_USERNAME)) {
      if (models.length > 1) {
        const model = models.find(
          (m) => m.car_model_id === carData.car_model_id
        );
        if (model) {
          handleModelSelection(model, setCarData);
          handleEnginePower(model, carData.year, setCarData);
        }
      }
    }
  }, [
    CHAT_ID,
    BOT_USERNAME,
    carData.year,
    models,
    carData.car_model_id,
    setCarData,
  ]);
}
*/
