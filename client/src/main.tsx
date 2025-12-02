import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker
if ('serviceWorker' in navigator && 'caches' in window) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silently fail if service worker registration fails
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
