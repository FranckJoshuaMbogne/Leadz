import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export type LearnerState = { status: "loading" } | { status: "signed-out" } | { status: "signed-in"; user: User };

/** Firebase Auth state. Pass `enabled = false` to avoid loading the SDK until needed. */
export function useLearner(enabled = true) {
  const [state, setState] = useState<LearnerState>({ status: "loading" });
  useEffect(() => {
    if (!enabled) return;
    let unsub = () => {};
    let cancelled = false;
    (async () => {
      const [auth, { onAuthStateChanged }] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
      if (cancelled) return;
      unsub = onAuthStateChanged(auth, (user) => setState(user ? { status: "signed-in", user } : { status: "signed-out" }));
    })();
    return () => {
      cancelled = true;
      unsub();
    };
  }, [enabled]);
  return state;
}

export function authErrorMessage(e: unknown) {
  const code = (e as { code?: string }).code ?? "";
  if (code.includes("popup-closed") || code.includes("cancelled-popup")) return "";
  if (code.includes("popup-blocked")) return "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.";
  if (code.includes("unauthorized-domain")) return "Sign-in isn't set up for this address yet. Please message us on WhatsApp.";
  return "Sign-in didn't work. Please try again.";
}
