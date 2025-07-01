import { isFunction } from "./utils";

const telegramEnv = {
  WebApp: null,
  isTelegramEnvironment: false,
};

/**
 * Инициализирует утилиты для работы с Telegram.
 * @param {object} WebApp - Объект `WebApp` из `useTelegram`.
 * @param {boolean} isTelegramEnvironment - Флаг, указывающий на запуск в среде Telegram.
 */
export const initTelegramUtils = (WebApp, isTelegramEnvironment) => {
  telegramEnv.WebApp = WebApp;
  telegramEnv.isTelegramEnvironment = isTelegramEnvironment;
};

/**
 * Показывает диалог подтверждения, используя API Telegram WebApp или стандартный `window.confirm`.
 * @param {string} message - Сообщение для отображения в диалоге.
 * @param {function} onConfirm - Функция обратного вызова, выполняемая при подтверждении.
 */
export const showConfirmation = (message, onConfirm) => {
  const { WebApp, isTelegramEnvironment } = telegramEnv;
  if (isTelegramEnvironment && WebApp && WebApp.showConfirm) {
    WebApp.showConfirm(message, (confirmed) => {
      if (confirmed && isFunction(onConfirm)) {
        onConfirm();
      }
    });
  } else {
    if (window.confirm(message)) {
      if (isFunction(onConfirm)) {
        onConfirm();
      }
    }
  }
};

/**
 * Сохраняет параметры из URL в localStorage
 */
export function saveParamsFromUrlToStorage(
  paramNames = ["user_id", "bot_username", "port", "chat_id"]
) {
  const params = new URLSearchParams(window.location.search);
  let changed = false;
  paramNames.forEach((name) => {
    const value = params.get(name);
    if (value !== null) {
      localStorage.setItem(`tgapp_${name}`, value);
      changed = true;
    }
  });
  return changed;
}

/**
 * Получает параметры из localStorage
 */
export function getParamsFromStorage(
  paramNames = ["user_id", "bot_username", "port", "chat_id"]
) {
  const result = {};
  paramNames.forEach((name) => {
    const value = localStorage.getItem(`tgapp_${name}`);
    if (value !== null) {
      result[name] = value;
    }
  });
  return result;
}
