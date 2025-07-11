import React from 'react';
import BasePage from './BasePage';
import { useTheme } from '../../theme/ThemeContext';

const ThemeSelector = () => {
  const { currentTheme, changeTheme, themeVariants } = useTheme();

  // Цвета кнопок для каждой темы
  const themeButtonColors = {
    [themeVariants.TELEGRAM_DARK]: '#8774e1',
    [themeVariants.DARK]: '#2196f3',
    [themeVariants.DARK_GRAY]: '#78909c',
    [themeVariants.SMOKY]: '#5c6bc0',
    [themeVariants.DARK_BLUE]: '#4fc3f7',
  };

  return (
    <BasePage
      pageTitle="Настройка темы"
      isShowControls={true}
      showBtnBack={true}
      showBtnClose={true}
      onBackClick={() => console.log("Back clicked")}
      onCloseClick={() => console.log("Close clicked")}
      controls={
        <div style={{ padding: "8px" }}>
          <h4>Выбор темы</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => changeTheme(themeVariants.TELEGRAM_DARK)}
              style={{ 
                padding: '8px', 
                backgroundColor: currentTheme === themeVariants.TELEGRAM_DARK ? themeButtonColors[themeVariants.TELEGRAM_DARK] : 'transparent', 
                color: 'white', 
                border: '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Telegram Dark
            </button>
            <button 
              onClick={() => changeTheme(themeVariants.DARK)}
              style={{ 
                padding: '8px', 
                backgroundColor: currentTheme === themeVariants.DARK ? themeButtonColors[themeVariants.DARK] : 'transparent', 
                color: 'white', 
                border: '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Темная (оригинальная)
            </button>
            <button 
              onClick={() => changeTheme(themeVariants.DARK_GRAY)}
              style={{ 
                padding: '8px', 
                backgroundColor: currentTheme === themeVariants.DARK_GRAY ? themeButtonColors[themeVariants.DARK_GRAY] : 'transparent', 
                color: 'white', 
                border: '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Темно-серая
            </button>
            <button 
              onClick={() => changeTheme(themeVariants.SMOKY)}
              style={{ 
                padding: '8px', 
                backgroundColor: currentTheme === themeVariants.SMOKY ? themeButtonColors[themeVariants.SMOKY] : 'transparent', 
                color: 'white', 
                border: '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Дымчатая
            </button>
            <button 
              onClick={() => changeTheme(themeVariants.DARK_BLUE)}
              style={{ 
                padding: '8px', 
                backgroundColor: currentTheme === themeVariants.DARK_BLUE ? themeButtonColors[themeVariants.DARK_BLUE] : 'transparent', 
                color: 'white', 
                border: '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Темно-голубая
            </button>
          </div>
        </div>
      }
    >
      <div>
        <h2>Настройка темы приложения</h2>
        <p>Выберите одну из доступных тем оформления в панели управления выше.</p>
        <p>Текущая тема: <strong>{currentTheme}</strong></p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Примеры элементов с текущей темой</h3>
          <div style={{ 
            padding: '16px', 
            border: '1px solid #666', 
            borderRadius: '8px',
            marginTop: '10px'
          }}>
            <p>Этот блок демонстрирует текущие цвета темы.</p>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '10px',
              marginTop: '10px'
            }}>
              {Object.entries(themeButtonColors).map(([theme, color]) => (
                <div 
                  key={theme}
                  style={{ 
                    width: '80px', 
                    height: '40px', 
                    backgroundColor: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '12px'
                  }}
                >
                  {theme}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default ThemeSelector;