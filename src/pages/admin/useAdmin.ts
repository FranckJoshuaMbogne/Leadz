import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { getDb, getFirebaseAuth } from "@/lib/firebase";

export type AdminState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "forbidden"; user: User }
  | { status: "admin"; user: User };

/**
 * Admin access = signed in with Firebase Auth AND a document exists at
 * admins/{uid}. The same check is enforced by Firestore security rules.
 */
export function useAdmin() {
  const [state, setState] = useState<AdminState>({ status: "loading" });

  useEffect(() => {
    let unsub = () => {};
    let cancelled = false;
    (async () => {
      const [auth, { onAuthStateChanged }] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
      unsub = onAuthStateChanged(auth, async (user) => {
        if (cancelled) return;
        if (!user) return setState({ status: "signed-out" });
        try {
          const [db, fs] = await Promise.all([getDb(), import("firebase/firestore/lite")]);
          const snap = await fs.getDoc(fs.doc(db, "admins", user.uid));
          setState(snap.exists() ? { status: "admin", user } : { status: "forbidden", user });
        } catch {
          setState({ status: "forbidden", user });
        }
      });
    })();
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  return state;
}

export async function signOutAdmin() {
  const [auth, { signOut }] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
  await signOut(auth);
}
