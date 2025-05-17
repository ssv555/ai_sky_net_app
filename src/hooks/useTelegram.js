import { useCallback, useEffect, useState, useRef } from "react";
import { copyToClipboard, showMessage, handleError } from "../utils/utils";

const SERVER_PORT =
  new URLSearchParams(window.location.search).get("port") || 5000;

const BOT_USERNAME =
  new URLSearchParams(window.location.search).get("bot_username") ||
  "ssv_test_bot";

const USER_ID = new URLSearchParams(window.location.search).get("user_id") || 0;

const CHAT_ID = new URLSearchParams(window.location.search).get("chat_id") || 0;

const isDevMode = () => {
  return BOT_USERNAME.toLowerCase().trim() !== "ai_sky_net_bot";
};

export const getApiUrl = () => {
  return isDevMode()
    ? `http://localhost:${SERVER_PORT}/api/dev/srv`
    : `http://195.2.75.212:${SERVER_PORT}/api/prod/srv`;
};

const MAX_RETRIES = 3;
const TIMEOUT = 10000; // 10 секунд
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

const requestCache = new Map();

const getCacheKey = (url, data) => {
  return `${url}-${JSON.stringify(data)}`;
};

const getCachedResponse = (cacheKey) => {
  const cached = requestCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  requestCache.delete(cacheKey);
  return null;
};

const setCachedResponse = (cacheKey, data) => {
  requestCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Хук для работы с Telegram WebApp
 * @returns {Object} Объект с методами и данными Telegram WebApp
 * @property {string} BOT_USERNAME - Имя бота
 * @property {Object} user - Данные пользователя
 * @property {Object} WebApp - Объект Telegram WebApp
 * @property {Object} MainButton - Объект главной кнопки
 * @property {Function} onClose - Функция закрытия приложения
 * @property {Function} onToggleButton - Функция переключения видимости главной кнопки
 * @property {Function} sendDataToServer - Функция отправки данных на сервер
 */
export const useTelegram = () => {
  const WebApp = window?.Telegram?.WebApp;
  const MainButton = window?.Telegram?.WebApp?.MainButton;
  const user = WebApp.initDataUnsafe?.user;
  const API_BASE_URL = getApiUrl();
  const abortControllerRef = useRef(null);

  /**
   * Закрывает Telegram WebApp
   */
  const onClose = useCallback(() => {
    if (!WebApp) return;
    WebApp.close();
  }, [WebApp]);

  /**
   * Переключает видимость главной кнопки
   */
  const toggleMainButton = useCallback(() => {
    if (!MainButton) return;
    if (MainButton.isVisible) {
      MainButton.hide();
    } else {
      MainButton.show();
    }
  }, [MainButton]);

  /**
   * Отправляет данные на сервер с поддержкой повторных попыток и CSRF защиты
   * @param {Object} data - Данные для отправки
   * @returns {Promise<Object>} Результат запроса
   * @throws {Error} Ошибка при отправке данных
   */
  const sendDataToServer = useCallback(
    async (data) => {
      if (!WebApp) return;
      if (!data) {
        WebApp.showAlert("Данные для отправки отсутствуют");
        return;
      }

      const url = `${API_BASE_URL}/car/carlist/add/`;
      const cacheKey = getCacheKey(url, data);
      const cachedResponse = getCachedResponse(cacheKey);

      if (cachedResponse) {
        WebApp.showAlert("Данные успешно отправлены (из кэша)");
        return cachedResponse;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(
        () => abortControllerRef.current.abort(),
        TIMEOUT
      );

      try {
        const send_data = {
          ...data,
          user_id: user.id,
        };

        let retries = 0;
        let lastError = null;

        while (retries < MAX_RETRIES) {
          try {
            const response = await fetch(url, {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(send_data),
              signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
              throw new Error(
                `HTTP ошибка! статус: ${response.status}\nURL:${url}`
              );
            }

            const result = await response.json();
            setCachedResponse(cacheKey, result);
            WebApp.showAlert("Данные успешно отправлены");
            return result;
          } catch (error) {
            lastError = error;
            handleError(error, WebApp);

            if (error.name === "AbortError") {
              throw error;
            }

            retries++;
            if (retries < MAX_RETRIES) {
              await new Promise((resolve) =>
                setTimeout(resolve, Math.pow(2, retries) * 1000)
              );
            }
          }
        }

        throw lastError;
      } catch (error) {
        handleError(error, WebApp);
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    },
    [WebApp, user, API_BASE_URL]
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    user,
    WebApp,
    MainButton,

    USER_ID,
    CHAT_ID,
    BOT_USERNAME,
    SERVER_PORT,
    API_BASE_URL,

    isDevMode,
    onClose,
    onToggleButton: toggleMainButton,
    sendDataToServer,
  };
};
