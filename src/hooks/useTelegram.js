const tg = window.Telegram?.WebApp;


export const useTelegram = () => {
  const onClose = () => {
    tg?.close();
  };

  const onToggleButton = () => {
    //tg?.MainButton?.toggle();
    tg?.BottomButton.toggle();
  };

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    onClose,
    onToggleButton,
  };
}