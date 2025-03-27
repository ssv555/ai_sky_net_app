import './App.css';
const tg = window.Telegram.WebApp;

function App() {

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <div className="App">
      Body of the app
    </div>
  );
}

export default App; 
