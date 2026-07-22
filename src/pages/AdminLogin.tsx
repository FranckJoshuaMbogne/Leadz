import { useState } from "react";
import { useNavigate } from "react-router-dom";

function sha256Hex(str: string) {
  const enc = new TextEncoder();
  return crypto.subtle.digest("SHA-256", enc.encode(str)).then((buf) => {
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  });
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Precomputed SHA-256 hashes for credentials (stored safely)
  const allowedEmailHash = "9bbb2de3fe742789052992449071b5fc3e99578ddccdd33fe8dfa427e21d89f4";
  const allowedPasswordHash = "5376eade6b88c9d617edc71efb15a500f92d1f30edfb4e36d1b2dda7966a3582";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const eh = await sha256Hex(email.trim());
    const ph = await sha256Hex(password);
    if (eh === allowedEmailHash && ph === allowedPasswordHash) {
      sessionStorage.setItem("admin_auth", "1");
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <form onSubmit={submit} className="w-full max-w-md rounded-card bg-elevated p-8">
        <h2 className="text-lg font-semibold">Admin Login</h2>
        <label className="mt-4 block text-sm">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md px-3 py-2" />
        <label className="mt-4 block text-sm">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-md px-3 py-2" />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button className="mt-6 w-full rounded-md bg-electric px-4 py-2 text-white">Sign in</button>
      </form>
    </div>
  );
}
