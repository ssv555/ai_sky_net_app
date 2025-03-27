import './App.css';
import { useEffect } from 'react';
import Button from './components/Button/Button';
import { useTelegram } from './hooks/useTelegram';

function App() {
  const { tg, onToggleButton } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <div className="App">
      <Button onClick={onToggleButton}>Toggle</Button>
      Body of the app
    </div>
  );
}

export default App;
