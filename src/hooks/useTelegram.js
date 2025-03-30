import { WebApp } from "@twa-dev/sdk";

export const useTelegram = () => {
  const onClose = () => {
    if (!WebApp) {
      console.error("Telegram WebApp не инициализирован");
      return;
    }
    WebApp.close();
  };

  const onToggleButton = () => {
    if (!WebApp?.MainButton) {
      console.error("MainButton не доступен");
      return;
    }
    if (WebApp.MainButton.isVisible) {
      WebApp.MainButton.hide();
    } else {
      WebApp.MainButton.show();
    }
  };

  const BOT_USERNAME =
    new URLSearchParams(window.location.search).get("bot_username") ||
    "unknown_bot_username"; // ssv_test_bot

  const sendDataToServer = (data) => {
    if (!WebApp) {
      console.error("Telegram WebApp не инициализирован");
      return;
    }
    if (!data) {
      WebApp.showAlert("Данные для отправки отсутствуют");
      return;
    }

    try {
      const baseUrl =
        BOT_USERNAME === "ai_sky_net_bot"
          ? "http://195.2.75.212:5000"
          : "http://localhost:5000";
      const url = `${baseUrl}/data/`;

      const send_data = {
        ...data,
        user_id: WebApp.initDataUnsafe?.user?.id,
      };

      fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(send_data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка сети");
          }
          return response.json();
        })
        .then((result) => {
          WebApp.showAlert("Данные успешно отправлены");
        })
        .catch((error) => {
          WebApp.showAlert(`Ошибка: ${error.message}`);
        });
    } catch (error) {
      WebApp.showAlert(`Ошибка: ${error.message}`);
    }
  };

  return {
    twa: WebApp,
    user: WebApp?.initDataUnsafe?.user,
    BOT_USERNAME,
    onClose,
    onToggleButton,
    sendDataToServer,
  };
};
