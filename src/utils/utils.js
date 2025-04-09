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
 * Показывает всплывающее сообщение в Telegram WebApp
 * @param {Object} WebApp - Объект Telegram WebApp
 * @param {string} message - Текст сообщения
 * @param {string} title - Заголовок сообщения
 * @returns {void}
 */
export const showMessage = (WebApp, message, title = "Сообщение") => {
  if (!WebApp) return;

  WebApp.showPopup(
    {
      title: title,
      message: message,
      buttons: [
        {
          id: "copy",
          type: "ok",
          text: "Копировать",
        },
      ],
    },
    (buttonId) => {
      if (buttonId === "copy") {
        copyToClipboard(message);
      }
    }
  );
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

  showMessage(WebApp, errorMessage, "Ошибка");
};
