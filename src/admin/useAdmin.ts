import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { getDb, getFirebaseAuth } from "@/lib/firebase";

export type AdminState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "forbidden"; user: User }
  | { status: "admin"; user: User };

/**
 * Admin = signed in AND allowed by firestore.rules (isAdmin()). We test it by
 * reading one lead, which only admins may do.
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
          await fs.getDocs(fs.query(fs.collection(db, "leads"), fs.limit(1)));
          setState({ status: "admin", user });
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

export async function signInWithGoogle() {
  const [auth, { GoogleAuthProvider, signInWithPopup }] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithPopup(auth, provider);
}

export async function signInWithEmail(email: string, password: string) {
  const [auth, { signInWithEmailAndPassword }] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutAdmin() {
  const [auth, { signOut }] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
  await signOut(auth);
}
