import './App.css';
import { useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import Button from './components/button/Button';

function App() {
  const { tg, user, onToggleButton } = useTelegram();

  useEffect(() => {
    try {
      tg?.ready();
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
    }
  }, []);

  return (
    <div className="App">
      <Button onClick={onToggleButton}>Toggle</Button>
      <br/>
      Body of the app of {user?.username}.
    </div>
  );
}

export default App;
