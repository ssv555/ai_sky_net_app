const tg = window.Telegram?.WebApp;

// tg.MainButton.setText("Ваш текст"); // Не забудьте создать кнопку, если она еще не была создана
// tg.MainButton.show();

export const useTelegram = () => {
  const onClose = () => {
    tg?.close();
  };

  const onToggleButton = () => {
    if (tg?.MainButton?.isVisible) {
      tg?.MainButton.hide();
    } else {
      tg?.MainButton.show();
    }
  };

  // const sendData = (data) => {
  //   // TODO: Размер данных ограничен 4096 символов, добавить проверку и отправку частями?.
  //   if (tg) {
  //     tg.sendData(JSON.stringify(data));
  //   }
  // };

  const BOT_USERNAME =
    new URLSearchParams(window.location.search).get("bot_username") ||
    "unknown_bot_username"; // ssv_test_bot

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    BOT_USERNAME,
    onClose,
    onToggleButton,
  };
};
