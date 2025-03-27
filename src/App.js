import './App.css';
import { useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';


function App() {
  const { tg, onToggleButton } = useTelegram();

  useEffect(() => {
    try {
      tg?.ready();
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
    }
  }, []);

  return (
    <div className="App">
      <button onClick={onToggleButton}>Toggle</button>
      <br/>
      Body of the app
    </div>
  );
}

export default App;
