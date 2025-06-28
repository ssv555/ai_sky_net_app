import apiService from "./apiService.js";

const apiProducts = {
  async getCommon(tg_user_id, date, short_endpoint) {
    const endpoint = `/products/${short_endpoint}/?tg_user_id=${tg_user_id}&date=${date}`;
    return await apiService().get(endpoint);
  },
  async getProducts(tg_user_id, date) {
    try {
      return await this.getCommon(tg_user_id, date, "get");
    } catch (error) {
      console.error("apiProducts.getProducts. Ошибка:", error);
      throw error;
    }
  },
  async getSum(tg_user_id, date) {
    try {
      return await this.getCommon(tg_user_id, date, "get_sum");
    } catch (error) {
      console.error("apiProducts.getSum. Ошибка:", error);
      throw error;
    }
  },
  async getSumMonByDays(tg_user_id, date) {
    try {
      return await this.getCommon(tg_user_id, date, "get_sum_mon_by_days");
    } catch (error) {
      console.error("apiProducts.getSumMonByDays. Ошибка:", error);
      throw error;
    }
  },
  async getSumMon(tg_user_id, date) {
    try {
      return await this.getCommon(tg_user_id, date, "get_sum_mon");
    } catch (error) {
      console.error("apiProducts.getSumMon. Ошибка:", error);
      throw error;
    }
  },
};

export default apiProducts;

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
