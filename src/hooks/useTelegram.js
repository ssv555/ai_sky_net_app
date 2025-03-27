const tg = window.Telegram.WebApp;


export const useTelegram = () => {
  const onClose = () => {
    tg.close();
  };

  const onToggleButton = () => {
    //tg.MainButton.toggle();
    if (tg.MainButton.isVisible()) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  };

  const onToggleButtonText = (text) => {
    tg.MainButton.setParams({ text });
  };

  return {
    tg,
    user: tg.initDataUnsafe?.user,
    onClose,
    onToggleButton,
    onToggleButtonText,
  };
}