// Мок объект для эмуляции Telegram WebApp в браузере
export const createTelegramMock = () => {
  if (typeof window !== 'undefined' && !window.Telegram) {
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
        ready: () => console.log('[Mock] WebApp ready'),
        expand: () => {
          console.log('[Mock] WebApp expand');
          window.Telegram.WebApp.isExpanded = true;
        },
        close: () => console.log('[Mock] WebApp close'),
        
        showAlert: (message, callback) => {
          console.log('[Mock] showAlert:', message);
          alert(message);
          if (callback) callback();
        },
        
        showConfirm: (message, callback) => {
          console.log('[Mock] showConfirm:', message);
          const result = confirm(message);
          if (callback) callback(result);
        },
        
        showPopup: (params, callback) => {
          console.log('[Mock] showPopup:', params);
          const result = confirm(params.message || 'Popup');
          if (callback) callback(result ? 'ok' : 'cancel');
        },
        
        onEvent: (eventType, eventHandler) => {
          console.log(`[Mock] onEvent: ${eventType}`);
        },
        
        offEvent: (eventType, eventHandler) => {
          console.log(`[Mock] offEvent: ${eventType}`);
        },
        
        sendData: (data) => {
          console.log('[Mock] sendData:', data);
        },
        
        openLink: (url) => {
          console.log('[Mock] openLink:', url);
          window.open(url, '_blank');
        },
        
        openTelegramLink: (url) => {
          console.log('[Mock] openTelegramLink:', url);
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
            console.log('[Mock] MainButton setText:', text);
          },
          
          onClick: function(callback) {
            this._callback = callback;
            console.log('[Mock] MainButton onClick set');
          },
          
          show: function() {
            this.isVisible = true;
            console.log('[Mock] MainButton show');
          },
          
          hide: function() {
            this.isVisible = false;
            console.log('[Mock] MainButton hide');
          },
          
          enable: function() {
            this.isActive = true;
            console.log('[Mock] MainButton enable');
          },
          
          disable: function() {
            this.isActive = false;
            console.log('[Mock] MainButton disable');
          },
          
          showProgress: function() {
            this.isProgressVisible = true;
            console.log('[Mock] MainButton showProgress');
          },
          
          hideProgress: function() {
            this.isProgressVisible = false;
            console.log('[Mock] MainButton hideProgress');
          }
        },
        
        // Кнопка назад
        BackButton: {
          isVisible: false,
          
          onClick: function(callback) {
            this._callback = callback;
            console.log('[Mock] BackButton onClick set');
          },
          
          show: function() {
            this.isVisible = true;
            console.log('[Mock] BackButton show');
          },
          
          hide: function() {
            this.isVisible = false;
            console.log('[Mock] BackButton hide');
          }
        },
        
        // Haptic Feedback
        HapticFeedback: {
          impactOccurred: (style) => console.log(`[Mock] HapticFeedback impact: ${style}`),
          notificationOccurred: (type) => console.log(`[Mock] HapticFeedback notification: ${type}`),
          selectionChanged: () => console.log('[Mock] HapticFeedback selection changed')
        }
      }
    };
    
    console.log('[Mock] Telegram WebApp объект создан для браузера');
  }
};