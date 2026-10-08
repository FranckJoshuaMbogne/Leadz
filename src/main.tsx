import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { HeadProvider } from "./lib/seo";
import { InsightsProvider } from "./lib/insights";
import "./index.css";

const container = document.getElementById("root")!;

const app = (
  <StrictMode>
    <HeadProvider>
      <InsightsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </InsightsProvider>
    </HeadProvider>
  </StrictMode>
);

// Pages are prerendered at build time (scripts/prerender.mjs); hydrate them.
// The SPA fallback (dev server, unknown routes) renders from scratch.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
