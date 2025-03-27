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
    }
  }, [tg]);

  return (
    <div className="App">
      <Header />
      <Button onClick={onToggleButton}>Toggle</Button>
      <br/>
      <br/>Body of the app of {user?.username}.
      <br/>tg.MainButton.isVisible: {tg?.MainButton?.isVisible === undefined ? 'undefined' : 'defined' }
    </div>
  );
}

export default App;
