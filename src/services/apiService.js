import { useTelegram } from "../hooks/useTelegram";

const { getApiUrl } = useTelegram();

const API_BASE_URL = getApiUrl();

const apiService = {
  // Метод для GET запросов
  async get(endpoint, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${endpoint}${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      throw error;
    }
  },

  // Метод для POST запросов
  async post(endpoint, data = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      throw error;
    }
  },

  // Метод для PUT запросов
  async put(endpoint, data = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      throw error;
    }
  },

  // Метод для DELETE запросов
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка при удалении данных:", error);
      throw error;
    }
  },
};

export default apiService;

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
