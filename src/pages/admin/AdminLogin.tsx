import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Seo } from "@/lib/seo";
import { getFirebaseAuth } from "@/lib/firebase";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/forms/Field";
import { useAdmin, signOutAdmin } from "./useAdmin";

export default function AdminLogin() {
  const navigate = useNavigate();
  const admin = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (admin.status === "admin") navigate("/dashboard", { replace: true });
  }, [admin, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const [auth, { signInWithEmailAndPassword }] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setError("Those credentials were not recognised.");
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!email.trim()) return setError("Enter your email first, then choose reset password.");
    try {
      const [auth, { sendPasswordResetEmail }] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
      await sendPasswordResetEmail(auth, email.trim());
    } catch {
      /* do not reveal whether the account exists */
    }
    setResetSent(true);
  };

  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-ivory-200 px-gutter py-16">
      <Seo title="Admin sign in" description="Springs 360 administration." path="/admin" noindex />
      <div className="w-full max-w-md">
        <Link to="/" className="inline-block text-ink">
          <Logo />
        </Link>
        <div className="mt-10 rounded border border-ink/10 bg-ivory-50 p-8 shadow-soft">
          <h1 className="font-display text-3xl text-ink">Admin</h1>
          {admin.status === "forbidden" ? (
            <div className="mt-6 space-y-4 text-ink-muted">
              <p>
                Signed in as <strong className="text-ink">{admin.user.email}</strong>, but this account does not have admin access.
              </p>
              <button type="button" className="underline" onClick={() => signOutAdmin()}>
                Sign out
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
              <TextField id="admin-email" label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField
                id="admin-password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p role="alert" className="text-sm text-[#9B2C2C]">
                  {error}
                </p>
              )}
              {resetSent && <p className="text-sm text-ink-muted">If that account exists, a reset link is on its way.</p>}
              <Button type="submit" className="w-full" disabled={busy || admin.status === "loading"}>
                {busy ? "Signing in…" : "Sign in"}
              </Button>
              <button type="button" onClick={reset} className="text-sm text-ink-muted underline-offset-4 hover:underline">
                Reset password
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
