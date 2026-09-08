import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

// Esto es lo que "monta" tu app de React dentro del <div id="root"> del index.html.
// BrowserRouter es lo que nos deja tener varias "páginas" (rutas) en una sola app:
// "/" para votar y "/admin" para tu panel privado.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
