import './react-fix';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root")!;

// Use client-side mounting (createRoot). We render a matching skeleton
// on the first render (see App.tsx) so React can attach to the existing
// DOM without causing hydration mismatches or large DOM replacements.
createRoot(rootEl).render(<App />);