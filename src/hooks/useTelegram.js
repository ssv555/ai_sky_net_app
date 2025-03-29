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

  const sendData = (data) => {
    if (tg) {
      tg.sendData(JSON.stringify(data));
    }
  };

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    onClose,
    onToggleButton,
    sendData,
  };
};
