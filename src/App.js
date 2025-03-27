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
        tg.MainButton.show(); // Отображаем кнопку после инициализации  
      });  
      tg.MainButton.setText("Ваш текст"); // Не забудьте создать кнопку, если она еще не была создана  
    }
  }, [tg]);

  return (
    <div className="App">
      <Header />
      <Button onClick={onToggleButton}>Toggle</Button>
      <br/>
      Body of the app of {user?.username}.
    </div>
  );
}

export default App;
