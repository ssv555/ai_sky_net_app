import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BASE_PATH } from "./config";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/index.css";

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
