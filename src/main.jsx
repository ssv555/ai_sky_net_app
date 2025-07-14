import React from "react";
import ReactDOM from "react-dom/client";
import "./theme/common.css"; // Импортируем общие стили первыми
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { developers } from './constants/constants';
import { createTelegramMock } from './utils/telegramMock';
import { suppressTelegramConsoleMessages } from './utils/consoleSuppressor';

// Подавляем нежелательные сообщения в консоли браузера
suppressTelegramConsoleMessages();

// Создаем мок Telegram WebApp для браузера
createTelegramMock();

const BASE_PATH = import.meta.env.VITE_BASE_PATH || "/";
console.log("[AI SKY NET] BASE_PATH:", BASE_PATH);

const router = createBrowserRouter(
  [
    {
      path: "/*",
      element: <App />,
    },
  ],
  {
    basename: BASE_PATH,
  }
);

const isDeveloper = () => {
  const WebApp = window?.Telegram?.WebApp;
  const userId = WebApp?.initDataUnsafe?.user?.id;
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = urlParams.get('user_id');
  
  return developers.includes(userId) || developers.includes(parseInt(userIdFromUrl));
};

if (isDeveloper() || process.env.NODE_ENV === 'development' || window.location.href.includes('eruda=true')) {
  // Асинхронная загрузка eruda
  import('eruda').then(module => {
    const eruda = module.default;
    eruda.init();
    console.log('Eruda загружена для разработчика');
    console.log(process.env.NODE_ENV);
    console.log(window.location.href);
  });
}

// Регистрируем сервис-воркер для кэширования
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  process.env.NODE_ENV === 'production' ? (
    <RouterProvider router={router} />
  ) : (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
);
