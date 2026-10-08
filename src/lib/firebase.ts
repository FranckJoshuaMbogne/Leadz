/**
 * Firebase is loaded lazily so the public site does not pay for the SDK until
 * it is needed (form submission, CMS reads, admin).
 *
 * Uses Firestore Lite (REST-based, much smaller) — the site does not need
 * realtime listeners.
 */
import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore/lite";
import type { Auth } from "firebase/auth";

const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env ?? {};

// Firebase web config is public by design; access is controlled by security rules.
export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyBmf_mejrKZrC4WVn6JLQMWXgPh1kNnaX8",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "leadzindb.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "leadzindb",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "leadzindb.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "98290313064",
  appId: env.VITE_FIREBASE_APP_ID || "1:98290313064:web:061704c8e06d77be5158dd",
};

let appPromise: Promise<FirebaseApp> | null = null;

function getApp() {
  if (!appPromise) {
    appPromise = import("firebase/app").then(({ initializeApp, getApps }) =>
      getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    );
  }
  return appPromise;
}

export async function getDb(): Promise<Firestore> {
  const [app, { getFirestore }] = await Promise.all([getApp(), import("firebase/firestore/lite")]);
  return getFirestore(app);
}

export async function getFirebaseAuth(): Promise<Auth> {
  const [app, { getAuth }] = await Promise.all([getApp(), import("firebase/auth")]);
  return getAuth(app);
}
