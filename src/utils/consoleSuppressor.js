// Утилита для подавления нежелательных сообщений в консоли браузера
export const suppressTelegramConsoleMessages = () => {
  // Проверяем, что мы в браузере и не в Telegram
  const isBrowser = typeof window !== 'undefined';
  const isTelegramApp = isBrowser && (
    window.location.href.includes('tgWebAppPlatform') || 
    window.location.href.includes('tgWebAppVersion') ||
    (window.parent !== window && window.parent.location.href.includes('telegram'))
  );
  
  // Подавляем сообщения только в браузере, не в Telegram
  if (isBrowser && !isTelegramApp && process.env.NODE_ENV !== 'development') {
    const originalConsoleWarn = console.warn;
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    // Список сообщений, которые нужно подавить
    const suppressedMessages = [
      'BackButton is not supported in version',
      'MainButton is not supported in version',
      'HapticFeedback is not supported in version',
      'Telegram.WebApp',
      'buttonCheckVersion',
      'telegram-web-app.js'
    ];
    
    // Функция для проверки, нужно ли подавить сообщение
    const shouldSuppress = (message) => {
      const messageStr = String(message);
      return suppressedMessages.some(suppressedMsg => 
        messageStr.includes(suppressedMsg)
      );
    };
    
    // Перехватываем console.warn
    console.warn = function(...args) {
      if (!args.some(arg => shouldSuppress(arg))) {
        originalConsoleWarn.apply(console, args);
      }
    };
    
    // Перехватываем console.log
    console.log = function(...args) {
      if (!args.some(arg => shouldSuppress(arg))) {
        originalConsoleLog.apply(console, args);
      }
    };
    
    // Перехватываем console.error
    console.error = function(...args) {
      if (!args.some(arg => shouldSuppress(arg))) {
        originalConsoleError.apply(console, args);
      }
    };
    
    // Сохраняем оригинальные функции для возможного восстановления
    window._originalConsole = {
      warn: originalConsoleWarn,
      log: originalConsoleLog,
      error: originalConsoleError
    };
  }
};

// Функция для восстановления оригинального поведения консоли
export const restoreConsole = () => {
  if (window._originalConsole) {
    console.warn = window._originalConsole.warn;
    console.log = window._originalConsole.log;
    console.error = window._originalConsole.error;
    delete window._originalConsole;
  }
};