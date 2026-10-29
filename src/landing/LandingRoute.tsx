import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import NotFound from "@/pages/NotFound";
import { fetchLandingPage } from "./api";
import { normalizePage } from "./defaults";
import { LandingView } from "./LandingView";
import type { LandingPage } from "./types";

/** Page data embedded by the prerenderer, so the page shows without waiting for Firestore. */
function embedded(slug: string): LandingPage | null {
  if (typeof document === "undefined") return null;
  try {
    const el = document.getElementById("__LANDING__");
    const data = el?.textContent ? (JSON.parse(el.textContent) as LandingPage) : null;
    return data && data.slug === slug ? normalizePage(data) : null;
  } catch {
    return null;
  }
}

export default function LandingRoute() {
  const { slug = "" } = useParams();
  const { search } = useLocation();
  const preview = new URLSearchParams(search).has("preview");
  const [page, setPage] = useState<LandingPage | null | undefined>(() => embedded(slug) ?? undefined);

  useEffect(() => {
    let off = false;
    const valid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
    if (!valid) {
      setPage(null);
      return;
    }
    fetchLandingPage(slug, preview)
      .then((p) => !off && setPage(p))
      .catch(() => !off && setPage((cur) => cur ?? null));
    return () => {
      off = true;
    };
  }, [slug, preview]);

  if (page === undefined) return <div className="min-h-screen bg-deep" aria-busy="true" />;
  if (page === null)
    return (
      <>
        <Navbar />
        <main id="main">
          <NotFound />
        </main>
        <Footer />
      </>
    );
  return <LandingView page={page} preview={preview} />;
}
