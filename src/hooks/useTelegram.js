const tg = window.Telegram?.WebApp;

if (!tg) {
  console.error('Telegram WebApp is not initialized');
}

export const useTelegram = () => {
  const onClose = () => {
    tg?.close();
  };

  const onToggleButton = () => {
    if (tg?.MainButton?.isVisible()) {
      tg?.MainButton?.hide();
    } else {
      tg?.MainButton?.show();
    }
  };

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    onClose,
    onToggleButton,
  };
}