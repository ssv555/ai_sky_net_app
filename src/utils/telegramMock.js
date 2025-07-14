// Мок объект для эмуляции Telegram WebApp в браузере
export const createTelegramMock = () => {
  // Проверяем, что мы в браузере и не в Telegram
  const isBrowser = typeof window !== 'undefined';
  const isTelegramApp = isBrowser && (
    window.location.href.includes('tgWebAppPlatform') || 
    window.location.href.includes('tgWebAppVersion') ||
    (window.parent !== window && window.parent.location.href.includes('telegram'))
  );
  
  if (isBrowser && !isTelegramApp && !window.Telegram) {
    window.Telegram = {
      WebApp: {
        initData: '',
        initDataUnsafe: {
          user: {
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            language_code: 'ru'
          },
          chat_instance: '123456789',
          chat_type: 'private',
          auth_date: Date.now()
        },
        version: '6.0',
        platform: 'web',
        colorScheme: 'light',
        BackButton: {
          show: () => {
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] BackButton show');
            }
          },
          hide: () => {
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] BackButton hide');
            }
          },
          onClick: (callback) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] BackButton onClick set');
            }
          },
          offClick: () => {
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] BackButton offClick');
            }
          }
        },
        themeParams: {
          bg_color: '#ffffff',
          text_color: '#000000',
          hint_color: '#999999',
          link_color: '#2481cc',
          button_color: '#2481cc',
          button_text_color: '#ffffff',
          secondary_bg_color: '#f1f1f1'
        },
        isExpanded: false,
        viewportHeight: window.innerHeight,
        viewportStableHeight: window.innerHeight,
        headerColor: '#2481cc',
        backgroundColor: '#ffffff',
        isClosingConfirmationEnabled: false,
        
        // Методы
        ready: () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Mock] WebApp ready');
          }
        },
        expand: () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Mock] WebApp expand');
          }
          window.Telegram.WebApp.isExpanded = true;
        },
        close: () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Mock] WebApp close');
          }
        },
        
        showAlert: (message, callback) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Mock] showAlert:', message);
          }
          alert(message);
          if (callback) callback();
        },
        
        showConfirm: (message, callback) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Mock] showConfirm:', message);
          }
          const result = confirm(message);
          if (callback) callback(result);
        },
        
        showPopup: (params, callback) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Mock] showPopup:', params);
          }
          const result = confirm(params.message || 'Popup');
          if (callback) callback(result ? 'ok' : 'cancel');
        },
        
        onEvent: (eventType, eventHandler) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Mock] onEvent: ${eventType}`);
          }
        },
        
        offEvent: (eventType, eventHandler) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Mock] offEvent: ${eventType}`);
          }
        },
        
        sendData: (data) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Mock] sendData:', data);
          }
        },
        
        openLink: (url) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Mock] openLink:', url);
          }
          window.open(url, '_blank');
        },
        
        openTelegramLink: (url) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[Mock] openTelegramLink:', url);
          }
          window.open(url, '_blank');
        },
        
        // Главная кнопка
        MainButton: {
          text: 'CONTINUE',
          color: '#2481cc',
          textColor: '#ffffff',
          isVisible: false,
          isActive: true,
          isProgressVisible: false,
          
          setText: function(text) {
            this.text = text;
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] MainButton setText:', text);
            }
          },
          
          onClick: function(callback) {
            this._callback = callback;
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] MainButton onClick set');
            }
          },
          
          show: function() {
            this.isVisible = true;
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] MainButton show');
            }
          },
          
          hide: function() {
            this.isVisible = false;
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] MainButton hide');
            }
          },
          
          enable: function() {
            this.isActive = true;
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] MainButton enable');
            }
          },
          
          disable: function() {
            this.isActive = false;
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] MainButton disable');
            }
          },
          
          showProgress: function() {
            this.isProgressVisible = true;
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] MainButton showProgress');
            }
          },
          
          hideProgress: function() {
            this.isProgressVisible = false;
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] MainButton hideProgress');
            }
          }
        },
               
        // Haptic Feedback
        HapticFeedback: {
          impactOccurred: (style) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[Mock] HapticFeedback impact: ${style}`);
            }
          },
          notificationOccurred: (type) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[Mock] HapticFeedback notification: ${type}`);
            }
          },
          selectionChanged: () => {
            if (process.env.NODE_ENV === 'development') {
              console.log('[Mock] HapticFeedback selection changed');
            }
          }
        }
      }
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Mock] Telegram WebApp объект создан для браузера');
    }
  }
};