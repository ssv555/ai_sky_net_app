import { useCallback, useEffect, useState, useRef } from "react";
import { init, backButton, useSignal } from '@telegram-apps/sdk-react';
import { copyToClipboard, showMessage, handleError } from "../utils/utils";
import { getParamsFromStorage } from "../utils/telegramUtils";
import { postEvent } from '@telegram-apps/sdk';

// Инициализация SDK
init();

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
  console.log('Проверка Telegram окружения:');
  console.log('window.Telegram:', !!window?.Telegram);
  console.log('window.Telegram.WebApp:', !!window?.Telegram?.WebApp);
  console.log('location.search:', window.location.search);
  console.log('userAgent:', navigator.userAgent);
  
  // Основная проверка - наличие Telegram WebApp
  const hasWebApp = !!window?.Telegram?.WebApp;
  
  if (hasWebApp) {
    // В Telegram всегда есть WebApp объект
    console.log('Найден Telegram WebApp');
    return true;
  }
  
  // Дополнительные проверки для мобильных приложений
  const isTelegramMobile = 
    navigator.userAgent.includes('TelegramBot') ||
    navigator.userAgent.includes('Telegram') ||
    window.location.search.includes('tgWebApp');
    
  console.log('isTelegramMobile:', isTelegramMobile);
  return isTelegramMobile;
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
  // Используем window.Telegram.WebApp напрямую вместо импорта webApp
  const WebApp = window?.Telegram?.WebApp;
  const BackButton = backButton;
  const isBackButtonVisible = useSignal(backButton.isVisible);
  const user = WebApp?.initDataUnsafe?.user || { id: USER_ID } || null;
  const API_BASE_URL = getApiUrl();
  const abortControllerRef = useRef(null);

  const onClose = useCallback(() => {
    if (!WebApp) return;
    WebApp.close();
  }, [WebApp]);

  const toggleMainButton = useCallback(() => {
    if (!WebApp?.MainButton) return;
    if (WebApp.MainButton.isVisible) {
      WebApp.MainButton.hide();
    } else {
      WebApp.MainButton.show();
    }
  }, [WebApp]);

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

  const setBackButton = useCallback((isVisible, onClick = null) => {
    try {
      // Используем новый метод web_app_setup_back_button
      postEvent('web_app_setup_back_button', { is_visible: isVisible });
      
      if (isVisible && onClick) {
        // Устанавливаем обработчик события
        window.Telegram?.WebApp?.onEvent('backButtonClicked', onClick);
      } else if (!isVisible) {
        // Убираем обработчик при скрытии кнопки
        window.Telegram?.WebApp?.offEvent('backButtonClicked');
      }
    } catch (error) {
      console.error('Ошибка настройки кнопки назад:', error);
      // Fallback на старый метод
      if (isVisible) {
        backButton.show();
        if (onClick) backButton.onClick(onClick);
      } else {
        backButton.hide();
      }
    }
  }, []);

  const showBackButton = useCallback((callback) => {
    try {
      if (!backButton.isMounted) {
        backButton.mount();
      }
      backButton.show();
      if (callback && typeof callback === 'function') {
        backButton.on('click', callback);
      }
    } catch (error) {
      console.warn('Ошибка при показе backButton:', error);
    }
  }, []);

  const hideBackButton = useCallback(() => {
    try {
      if (backButton.isMounted && backButton.isVisible) {
        backButton.hide();
        backButton.off('click');
      }
    } catch (error) {
      console.warn('Ошибка при скрытии backButton:', error);
    }
  }, []);

  return {
    user,
    WebApp,
    MainButton: WebApp?.MainButton,
    BackButton,
    USER_ID,
    CHAT_ID,
    BOT_USERNAME,
    SERVER_PORT,
    API_BASE_URL,
    isDevMode,
    onClose,
    toggleMainButton,
    sendDataToServer,
    isTelegramEnvironment: isTelegramEnvironment,
    showNotification,
    showBackButton,
    hideBackButton,
    setBackButton,
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
