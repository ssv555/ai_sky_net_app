import './App.css';
import { useEffect, useState } from 'react';
import { useTelegram } from './hooks/useTelegram';
import Button from './components/button/Button';

function App() {
  const { tg, user, onToggleButton } = useTelegram();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      if (tg) {
        tg.ready();
        setIsReady(true);
        console.log('Telegram WebApp is ready');
      } else {
        console.error('Telegram WebApp is not available');
      }
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
    }
  }, [tg]);

  return (
    <div className="App">
      <Button onClick={onToggleButton}>Toggle</Button>
      <br/>
      Body of the app of {user?.username}.
      {!isReady && <div>Waiting for Telegram WebApp initialization...</div>}
    </div>
  );
}

export default App;
