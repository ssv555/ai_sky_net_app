import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/index.css";

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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
