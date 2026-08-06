import React from "react";
import { createRoot } from "react-dom/client";
import App from "../PrizeBondApp.jsx";
import { LanguageProvider } from "./i18n.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
