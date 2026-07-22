import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const ok = sessionStorage.getItem("admin_auth");
    if (!ok) navigate("/admin");
  }, [navigate]);

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("contact_submissions") || "[]");
      setItems(existing);
    } catch (e) {
      setItems([]);
    }
  }, []);

  const respond = (email: string, name: string) => {
    // Open mail client as a simple response flow
    const subject = encodeURIComponent("Regarding your LeadZ.in inquiry");
    const body = encodeURIComponent(`Hi ${name},%0D%0A%0D%0AThanks for reaching out — replying from admin dashboard.`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const signOut = () => {
    sessionStorage.removeItem("admin_auth");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div>
            <Link to="/" className="mr-3 text-sm text-silver">
              View site
            </Link>
            <button onClick={signOut} className="rounded-md bg-white/[0.04] px-3 py-2">
              Sign out
            </button>
          </div>
        </div>

        <section className="rounded-card bg-elevated p-6">
          <h2 className="text-lg font-semibold">Form submissions</h2>
          {items.length === 0 ? (
            <p className="mt-4 text-sm text-silver">No submissions yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {items.map((it, idx) => (
                <li key={idx} className="flex items-start justify-between rounded-md border border-white/[0.04] p-4">
                  <div>
                    <div className="text-sm font-semibold">{it.name} — <span className="text-silver">{it.service}</span></div>
                    <div className="mt-1 text-xs text-silver">{it.email} • {it.phone}</div>
                    <div className="mt-2 text-sm text-silver">{it.message}</div>
                    <div className="mt-2 text-xs text-silver">{it.city || ""} {it.country ? `• ${it.country}` : ""}</div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <div className="text-xs text-silver">{new Date(it.createdAt).toLocaleString()}</div>
                    <button onClick={() => respond(it.email, it.name)} className="rounded-md bg-electric px-3 py-1 text-xs text-white">Respond</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
