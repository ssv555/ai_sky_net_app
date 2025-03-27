import './App.css';
const tg = window.Telegram.WebApp;


function App() {

  const onClose = () => {
    tg.close();
  }

  return (
    <div className="App">
      work
      <button onClick={onClose} className="app__close">Закрыть</button>
    </div>
  );
}

export default App;
