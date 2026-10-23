import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { HeadProvider } from "./lib/seo";
import { InsightsProvider } from "./lib/insights";
import { ContentProvider, type InitialContent } from "./content/ContentProvider";
import "./index.css";

const container = document.getElementById("root")!;

// Content embedded by the prerenderer (same data the static HTML was built with).
let initial: InitialContent | undefined;
try {
  const el = document.getElementById("__CONTENT__");
  if (el?.textContent) initial = JSON.parse(el.textContent);
} catch {
  /* fall back to built-in content */
}

const app = (
  <StrictMode>
    <HeadProvider>
      <ContentProvider initial={initial}>
        <InsightsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </InsightsProvider>
      </ContentProvider>
    </HeadProvider>
  </StrictMode>
);

// Pages are prerendered at build time (scripts/prerender.mjs); hydrate them.
// The SPA fallback (dev server, unknown routes) renders from scratch.
if (container.firstElementChild && !container.hasAttribute("data-fallback")) hydrateRoot(container, app);
else {
  container.innerHTML = "";
  createRoot(container).render(app);
}
