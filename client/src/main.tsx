import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { WishlistProvider } from "./context/WishlistContext";
import { AlertsProvider } from "./context/AlertsContext";
import { SearchHistoryProvider } from "./context/SearchHistoryContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchHistoryProvider>
        <WishlistProvider>
          <AlertsProvider>
            <App />
          </AlertsProvider>
        </WishlistProvider>
      </SearchHistoryProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
