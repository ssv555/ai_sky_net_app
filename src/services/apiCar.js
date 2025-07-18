import apiService from "./apiService.js";

const apiCar = {
  // Common
  async getBrands(params = {}) {
    try {
      const endpoint = "/car/brands/";
      return await apiService().get(endpoint, params);
    } catch (error) {
      console.error("getBrands. Ошибка получения данных:", error);
      throw error;
    }
  },
  async getModels(car_brand_id) {
    try {
      const endpoint = `/car/models/?car_brand_id=${car_brand_id}`;
      return await apiService().get(endpoint);
    } catch (error) {
      console.error("getModels. Ошибка получения данных:", error);
      throw error;
    }
  },

  // Users
  async getCarList(user_id) {
    try {
      const endpoint = `/car/carlist/?tg_user_id=${user_id}`;
      return await apiService().get(endpoint);
    } catch (error) {
      console.error("getCarList. Ошибка получения данных:", error);
      throw error;
    }
  },
};

export default apiCar;

/*
// использовать этот сервис следующим образом:

import apiService from './services/apiService';

// GET запрос
const data = await apiService.get('/users', { page: 1, limit: 10 });

// POST запрос
const newUser = await apiService.post('/users', { name: 'John', age: 30 });

// PUT запрос
const updatedUser = await apiService.put('/users/1', { name: 'John Updated' });

// DELETE запрос
await apiService.delete('/users/1');
*/
