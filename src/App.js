import './App.css';
import { useTelegram } from './hooks/useTelegram';

function App() {
  const { tg, onToggleButton } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <div className="App">
      <Header />
      <div>
        <Button onClick={onToggleButton}>Toggle</Button>
      </div>
      Body of the app
    </div>
  );
}

export default App; 
