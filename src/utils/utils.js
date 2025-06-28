import { encode, decode } from "windows-1251";

/**
 * Копирует текст в буфер обмена
 * @param {string} text - Текст для копирования
 * @returns {Promise<void>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Ошибка при копировании в буфер обмена:", err);
  }
};

/**
 * Показывает сообщение пользователю
 * @param {string} message - Сообщение для показа
 * @param {string} title - Заголовок сообщения (опционально)
 */
export const showMessage = (message, title = null) => {
  const WebApp = window?.Telegram?.WebApp;

  if (WebApp?.showAlert) {
    const fullMessage = title ? `${title}: ${message}` : message;
    WebApp.showAlert(fullMessage);
  } else {
    // Альтернативное уведомление для браузера
    const fullMessage = title ? `${title}: ${message}` : message;
    alert(`ℹ️ ${fullMessage}`);
  }

  // Копируем сообщение в буфер обмена автоматически
  copyToClipboard(message);
};

/**
 * Обработчик ошибок для HTTP запросов
 * @param {Error} error - Объект ошибки
 * @param {Object} WebApp - Объект Telegram WebApp
 * @returns {void}
 */
export const handleError = (error, WebApp) => {
  if (!WebApp) return;

  const errorMessage =
    error.name === "AbortError"
      ? "Запрос превысил время ожидания"
      : `Ошибка: ${error.message}`;

  showMessage(errorMessage, "Ошибка");
};

/**
 * Конвертирует строку из UTF-8 в Windows-1251 (Uint8Array)
 * @param {string} utf8Str
 * @returns {Uint8Array}
 */
export function utf8ToWin1251(utf8Str) {
  return encode(utf8Str);
}

/**
 * Конвертирует Uint8Array из Windows-1251 в строку UTF-8
 * @param {Uint8Array} win1251Arr
 * @returns {string}
 */
export function win1251ToUtf8(win1251Arr) {
  return decode(win1251Arr);
}
