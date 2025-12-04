import './react-fix';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const initLoader = document.getElementById('init-loader');
if (initLoader) {
  initLoader.remove();
}

createRoot(document.getElementById("root")!).render(<App />);