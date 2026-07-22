import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [light, setLight] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("site_theme");
      if (stored) return stored === "light";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (light) {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("site_theme", "light");
      } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("site_theme", "dark");
      }
    } catch (e) {
      // ignore
    }
  }, [light]);

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setLight((s) => !s)}
      className="ml-3 inline-flex items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-sm text-ink"
    >
      {light ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
