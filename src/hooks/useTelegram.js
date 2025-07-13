import { useCallback, useEffect, useState, useRef } from "react";
import { copyToClipboard, showMessage, handleError } from "../utils/utils";
import { getParamsFromStorage } from "../utils/telegramUtils";

const urlParams = new URLSearchParams(window.location.search);
const storageParams = getParamsFromStorage();

const SERVER_PORT = urlParams.get("port") || storageParams.port || 5000;

const BOT_USERNAME =
  urlParams.get("bot_username") || storageParams.bot_username || "ssv_test_bot";

const USER_ID = urlParams.get("user_id") || storageParams.user_id || 0;

const CHAT_ID = urlParams.get("chat_id") || storageParams.chat_id || 0;

const isDevMode = () => {
  return BOT_USERNAME.toLowerCase().trim() !== "ai_sky_net_bot";
};

export const getApiUrl = () => {
  return isDevMode()
    ? `http://localhost:${SERVER_PORT}/api/dev/srv`
    : `https://it-joy.ru/api/prod/srv`;
};

console.log(`SERVER_PORT:  ${SERVER_PORT}`);
console.log(`BOT_USERNAME: ${BOT_USERNAME}`);
console.log(`USER_ID:      ${USER_ID}`);
console.log(`CHAT_ID:      ${CHAT_ID}`);
console.log(`isDevMode:    ${isDevMode()}`);

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
 * Проверяет, запущено ли приложение в Telegram
 * @returns {boolean} true если в Telegram, false если в браузере
 */
export const isTelegramEnvironment = () => {
  // Проверяем наличие Telegram WebApp
  const hasWebApp = !!window?.Telegram?.WebApp;

  if (!hasWebApp) {
    return false;
  }

  // Дополнительные проверки для определения Telegram
  const isInTelegram =
    // Проверяем URL параметры Telegram
    window.location.search.includes("tgWebApp") ||
    // Проверяем user agent (может быть ненадежно)
    navigator.userAgent.includes("Telegram") ||
    // Проверяем, что WebApp инициализирован (безопасно)
    !!window.Telegram?.WebApp?.initDataUnsafe?.user;

  return isInTelegram;
};

/**
 * Показывает уведомление в зависимости от окружения
 * @param {string} message - Сообщение для показа
 * @param {string} type - Тип уведомления ('success', 'error', 'info')
 */
export const showNotification = (message, type = "info") => {
  try {
    // Проверяем, что мы в Telegram и WebApp доступен
    if (isTelegramEnvironment() && window?.Telegram?.WebApp?.showAlert) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      // Альтернативное уведомление для браузера
      const emoji = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
      alert(`${emoji} ${message}`);
    }
  } catch (error) {
    // Fallback на обычный alert если что-то пошло не так
    console.warn("Ошибка при показе уведомления:", error);
    alert(message);
  }
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
  const user = WebApp?.initDataUnsafe?.user || { id: USER_ID } || null;
  const API_BASE_URL = getApiUrl();
  const abortControllerRef = useRef(null);

  console.log(`user:         ${JSON.stringify(user)}`); // TODO: Удалить через некоторое время, написано 2025-07-01.

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
        showNotification("Данные для отправки отсутствуют", "error");
        return;
      }

      const url = `${API_BASE_URL}/car/carlist/add/`;
      const cacheKey = getCacheKey(url, data);
      const cachedResponse = getCachedResponse(cacheKey);

      if (cachedResponse) {
        showNotification("Данные успешно отправлены (из кэша)", "success");
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
            showNotification("Данные успешно отправлены", "success");
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
    toggleMainButton,
    sendDataToServer,
    isTelegramEnvironment,
    showNotification,
  };
};

// Применяет CSS-переменные Telegram WebApp к :root
export function applyTelegramTheme(themeParams) {
  if (!themeParams || typeof window === "undefined") return;
  const root = document.documentElement;
  Object.entries(themeParams).forEach(([key, value]) => {
    if (key && value) {
      root.style.setProperty(`--tg-theme-${key.replace(/_/g, "-")}`, value);
    }
  });
}

// Хук для автоматического применения темы Telegram
export function useApplyTelegramTheme() {
  useEffect(() => {
    if (window?.Telegram?.WebApp?.themeParams) {
      window?.Telegram?.WebApp?.ready();
      applyTelegramTheme(window.Telegram.WebApp.colorScheme);
      //const themeParams = Telegram.WebApp.themeParams;
      //const colorScheme = Telegram.WebApp.colorScheme;
    }
  }, []);
}
