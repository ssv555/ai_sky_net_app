const tg = window.Telegram?.WebApp;

// tg.MainButton.setText("Ваш текст"); // Не забудьте создать кнопку, если она еще не была создана
// tg.MainButton.show();

export const useTelegram = () => {
  const onClose = () => {
    tg?.close();
  };

  const onToggleButton = () => {
    if (tg?.MainButton?.isVisible === true) {
      tg?.MainButton.hide();
    } else {
      tg?.MainButton.show();
    }
  };

  const setHeaderText = (text) => {
    if (tg) {
      if (text) {
        tg.setHeaderText(text);
      } else {
        const botName = tg.initDataUnsafe?.bot?.username || "Test Bot...";
        const userName = tg.initDataUnsafe?.user?.username || "Пользователь";
        tg.setHeaderText(`${botName} | ${userName}`);
      }
    }
  };

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    onClose,
    onToggleButton,
    setHeaderText,
  };
};
