import { useCallback } from "react";

const BOT_USERNAME =
  new URLSearchParams(window.location.search).get("bot_username") ||
  "unknown_bot_username"; // ssv_test_bot

const MAX_RETRIES = 3;
const TIMEOUT = 10000; // 10 секунд

/**
 * Копирует текст в буфер обмена
 * @param {string} text - Текст для копирования
 * @returns {Promise<void>}
 */
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Ошибка при копировании в буфер обмена:", err);
  }
};

/**
 * Обработчик ошибок для HTTP запросов
 * @param {Error} error - Объект ошибки
 * @param {Object} WebApp - Объект Telegram WebApp
 * @returns {void}
 */
const handleError = (error, WebApp) => {
  if (!WebApp) return;

  const errorMessage =
    error.name === "AbortError"
      ? "Запрос превысил время ожидания"
      : `Ошибка: ${error.message}`;

  WebApp.showPopup(
    {
      title: "Ошибка",
      message: errorMessage,
      buttons: [
        {
          id: "copy",
          type: "default",
          text: "Копировать",
        },
        {
          id: "ok",
          type: "ok",
        },
      ],
    },
    (buttonId) => {
      if (buttonId === "copy") {
        copyToClipboard(errorMessage);
      }
    }
  );
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

  if (!WebApp) {
    console.warn("Telegram WebApp не инициализирован");
  }

  /**
   * Закрывает Telegram WebApp
   */
  const isDevMode = useCallback(() => {
    return BOT_USERNAME !== "ai_sky_net_bot";
  }, [BOT_USERNAME]);

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
        const baseUrl = isDevMode()
          ? "http://localhost:5000"
          : "http://195.2.75.212:5000";
        const url = `${baseUrl}/data/`;

        // Получаем CSRF токен из мета-тега
        const csrfToken = document.querySelector(
          'meta[name="csrf-token"]'
        )?.content;

        const send_data = {
          ...data,
          user_id: WebApp.initDataUnsafe?.user?.id,
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
                "X-CSRF-Token": csrfToken || "",
                "X-Requested-With": "XMLHttpRequest",
              },
              credentials: "include", // Включаем передачу куки
              body: JSON.stringify(send_data),
              signal: controller.signal,
            });

            if (!response.ok) {
              throw new Error(`HTTP ошибка! статус: ${response.status}`);
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
    user: WebApp?.initDataUnsafe?.user,
    WebApp,
    MainButton,
    isDevMode,
    onClose,
    onToggleButton: toggleMainButton,
    sendDataToServer,
    testErrorHandling,
  };
};
