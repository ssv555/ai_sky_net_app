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
  console.error('Обработка ошибки:', error);
  
  let errorMessage = 'Произошла неизвестная ошибка';
  
  if (error) {
    if (error.name === "AbortError") {
      errorMessage = "Запрос превысил время ожидания";
    } else if (error.message) {
      errorMessage = `Ошибка: ${error.message}`;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      // Если ошибка - объект, попробуем извлечь полезную информацию
      errorMessage = `Ошибка: ${JSON.stringify(error, null, 2)}`;
    }
  }
  
  console.log('Сообщение об ошибке:', errorMessage);
  showMessage(errorMessage, "Что-то пошло не так");
};

export const isObject = (value) => {
  return typeof value === "object" && value !== null;
};

export const isFunction = (value) => {
  return typeof value === "function";
};
