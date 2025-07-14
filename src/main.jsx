import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import eruda from 'eruda';
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

if (process.env.NODE_ENV === 'development' || isDeveloper() || window.location.href.includes('eruda=true')) {
  eruda.init();
  console.log('Eruda загружена для разработчика');
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
