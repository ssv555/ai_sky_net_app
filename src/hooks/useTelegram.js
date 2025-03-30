const tg = window.Telegram?.WebApp;

export const useTelegram = () => {
  const onClose = () => {
    if (!tg) {
      console.error("Telegram WebApp не инициализирован");
      return;
    }
    tg.close();
  };

  const onToggleButton = () => {
    if (!tg?.MainButton) {
      console.error("MainButton не доступен");
      return;
    }
    if (tg.MainButton.isVisible) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  };

  const BOT_USERNAME =
    new URLSearchParams(window.location.search).get("bot_username") ||
    "unknown_bot_username"; // ssv_test_bot

  const sendDataToServer = (data) => {
    if (!tg) {
      console.error("Telegram WebApp не инициализирован");
      return;
    }
    if (!data) {
      tg.showAlert("Данные для отправки отсутствуют");
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
        user_id: tg.initDataUnsafe?.user?.id,
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
          tg.showAlert("Данные успешно отправлены");
        })
        .catch((error) => {
          tg.showAlert(`Ошибка: ${error.message}`);
        });
    } catch (error) {
      tg.showAlert(`Ошибка: ${error.message}`);
    }
  };

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    BOT_USERNAME,
    onClose,
    onToggleButton,
    sendDataToServer,
  };
};
