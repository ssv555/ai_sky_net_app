import { useState, useEffect, useCallback, useMemo } from 'react';

const tg = window.Telegram?.WebApp;

// Константы
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
};

export const getApiUrl = () => {
  const savedUrl = localStorage.getItem('api_url');
  if (savedUrl) return savedUrl;
  
  return isDevelopment() 
    ? 'http://localhost:8000/api'
    : 'https://your-production-api.com/api';
};

export const isTelegramEnvironment = () => {
  if (typeof window === 'undefined') return false;
  
  // Более точная проверка среды Telegram
  const isTelegramApp = 
    window.location.href.includes('tgWebAppPlatform') || 
    window.location.href.includes('tgWebAppVersion') ||
    window.location.href.includes('tgWebAppThemeParams') ||
    (window.parent !== window && window.parent.location.href.includes('telegram')) ||
    (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) ||
    document.referrer.includes('telegram');
    
  return isTelegramApp && !!window.Telegram?.WebApp;
};

// Основной хук
export const useTelegram = () => {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const [themeParams, setThemeParams] = useState({});

  // Инициализация WebApp
  useEffect(() => {
    if (tg) {
      try {
        tg.ready();
        setIsReady(true);
        setUser(tg.initDataUnsafe?.user || null);
        setThemeParams(tg.themeParams || {});
        
        // Применяем тему
        if (tg.themeParams) {
          document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
          document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
          document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
          document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#2481cc');
          document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2481cc');
          document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
        }
      } catch (error) {
        console.error('Ошибка инициализации Telegram WebApp:', error);
      }
    } else {
      // Эмуляция для браузера
      setIsReady(true);
      setUser({ id: 12345, first_name: 'Test', username: 'testuser' });
    }
  }, []);

  // Управление кнопкой "Назад"
  const setBackButton = useCallback((show, callback) => {
    // Проверяем, что мы в Telegram, а не в браузере
    if (!isTelegramEnvironment() || !tg?.BackButton) {
      if (isDevelopment()) {
        console.log('BackButton недоступна в браузере или не поддерживается');
      }
      return;
    }
    
    try {
      if (show && callback) {
        tg.BackButton.show();
        tg.BackButton.onClick(callback);
      } else {
        tg.BackButton.hide();
        tg.BackButton.offClick();
      }
    } catch (error) {
      if (isDevelopment()) {
        console.error('Ошибка управления кнопкой назад:', error);
      }
    }
  }, []);

  // Показать уведомление
  const showNotification = useCallback((message, type = 'info') => {
    if (tg) {
      try {
        tg.showAlert(message);
      } catch (error) {
        console.error('Ошибка показа уведомления:', error);
        alert(message);
      }
    } else {
      // Для браузера
      console.log(`[${type.toUpperCase()}] ${message}`);
      alert(message);
    }
  }, []);

  // Отправка данных на сервер
  const sendDataToServer = useCallback((data) => {
    if (!tg) {
      console.log('Данные для отправки:', data);
      return;
    }
    
    try {
      tg.sendData(JSON.stringify(data));
    } catch (error) {
      console.error('Ошибка отправки данных:', error);
      showNotification('Ошибка отправки данных', 'error');
    }
  }, [showNotification]);

  // Проверка режима разработки
  const isDevMode = useCallback(() => {
    return isDevelopment();
  }, []);

  // Получение данных пользователя и чата
  const USER_ID = user?.id || null;
  const CHAT_ID = tg?.initDataUnsafe?.chat?.id || null;
  const BOT_USERNAME = '@your_bot_username'; // Замените на ваш бот

  // MainButton
  const MainButton = useMemo(() => {
    if (!tg) {
      return {
        setText: (text) => {
          if (isDevelopment()) {
            console.log('MainButton setText:', text);
          }
        },
        show: () => {
          if (isDevelopment()) {
            console.log('MainButton show');
          }
        },
        hide: () => {
          if (isDevelopment()) {
            console.log('MainButton hide');
          }
        },
        onClick: (callback) => {
          if (isDevelopment()) {
            console.log('MainButton onClick:', callback);
          }
        },
        offClick: (callback) => {
          if (isDevelopment()) {
            console.log('MainButton offClick:', callback);
          }
        }
      };
    }
    return tg.MainButton;
  }, []);

  return {
    WebApp: tg,
    user,
    isReady,
    themeParams,
    isTelegramEnvironment: isTelegramEnvironment(),
    setBackButton,
    showNotification,
    sendDataToServer,
    isDevMode,
    USER_ID,
    CHAT_ID,
    BOT_USERNAME,
    MainButton
  };
};

export default useTelegram;
