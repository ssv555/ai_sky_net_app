const tg = window.Telegram?.WebApp;

if (!tg) {
  console.error('Telegram WebApp is not initialized');
} else {
  console.log('Telegram WebApp initialized:', tg);
}

export const useTelegram = () => {
  const onClose = () => {
    tg?.close();
  };

  const onToggleButton = () => {
    console.log('Toggle button clicked');
    console.log('MainButton exists:', !!tg?.MainButton);
    console.log('MainButton is visible:', tg?.MainButton?.isVisible());
    tg?.MainButton?.toggle();
  };

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    onClose,
    onToggleButton,
  };
}