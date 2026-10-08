/**
 * Minimal, vendor-neutral event tracking.
 * Pushes to `window.dataLayer` (Google Tag Manager) and calls `gtag` if present.
 * Nothing is sent anywhere unless a tag is installed on the page.
 */
type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    window.gtag?.("event", event, params);
  } catch {
    /* tracking must never break the UI */
  }
}
