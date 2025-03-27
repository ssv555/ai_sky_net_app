import './App.css';
import { useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import Button from './components/button/Button';
import Header from './components/header/Header';


function App() {
  const { tg, user, onToggleButton } = useTelegram();

  useEffect(() => {
    if (tg) {  
      tg.ready();
      tg.onEvent('online', () => {  
        tg.BottomButton.show(); // Отображаем кнопку после инициализации  
      });
      tg.BottomButton.setText("Ваш текст"); // Не забудьте создать кнопку, если она еще не была создана
    }
  }, [tg]);

  return (
    <div className="App">
      <Header />
      <Button onClick={onToggleButton}>Toggle</Button>
      <br/>
      <br/>Body of the app of {user?.username}.
      <br/>tg.BottomButton: {tg?.BottomButton === undefined ? 'undefined' : 'defined'}
      <br/>tg.BottomButton.isVisible(): {tg?.BottomButton?.isVisible() === undefined ? 'undefined' : 'defined'}
    </div>
  );
}

export default App;
