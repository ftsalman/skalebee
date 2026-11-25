import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./App.css";
import { App } from "./App";

const container = document.getElementById("root");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// index.html may contain a prerendered copy of the page (for search engines, see
// scripts/prerender.mjs). It stays invisible until the app has drawn the live page.
if (container.hasAttribute("data-prerendered")) {
  requestAnimationFrame(() => requestAnimationFrame(() => container.removeAttribute("data-prerendered")));
}
