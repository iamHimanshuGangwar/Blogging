// client/src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css"; // Tailwind + global styles
import { AppProvider } from "./context/AppContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationsProvider } from "./context/NotificationsContext.jsx";
import AuthModal from "./components/AuthModal.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <NotificationsProvider>
          <BrowserRouter>
            <App />
            <AuthModal /> {/* Listens to AuthContext for login/signup/OTP */}
          </BrowserRouter>
        </NotificationsProvider>
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);
