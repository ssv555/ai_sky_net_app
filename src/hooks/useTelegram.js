import { useCallback, useEffect, useState } from "react";
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

      try {
        const url = `${API_BASE_URL}/car/garage/add/`;
        // // Получаем CSRF токен из мета-тега
        // const csrfToken = document.querySelector(
        //   'meta[name="csrf-token"]'
        // )?.content;

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
                // "X-CSRF-Token": csrfToken || "",
                // "X-Requested-With": "XMLHttpRequest",
              },
              // credentials: "include",
              body: JSON.stringify(send_data),
              signal: controller.signal,
            });

            if (!response.ok) {
              throw new Error(
                `HTTP ошибка! статус: ${response.status}\nURL:${url}`
              );
            }

            const result = await response.json();
            WebApp.showAlert("Данные успешно отправлены");
            return result;
          } catch (error) {
            lastError = error;
            handleError(error, WebApp);

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
    [WebApp, isDevMode]
  );

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
