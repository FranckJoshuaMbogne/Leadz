import { site } from "@/config/site";
import { track } from "./analytics";

export interface LeadPayload {
  intent: "strategy-call" | "general";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  industry?: string;
  channels?: string[];
  budget?: string;
  challenge?: string;
  outcome?: string;
  message?: string;
}

function clean<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
  ) as Partial<T>;
}

/**
 * Stores the lead in Firestore (`leads` collection) and, if configured, posts
 * it to an external webhook. Succeeds if at least one destination accepts it.
 */
export async function submitLead(payload: LeadPayload) {
  const page = typeof window !== "undefined" ? window.location.pathname : "";
  const data = clean({ ...payload, page });
  const results: boolean[] = [];

  try {
    const [{ getDb }, fs] = await Promise.all([import("./firebase"), import("firebase/firestore/lite")]);
    const db = await getDb();
    await fs.addDoc(fs.collection(db, "leads"), { ...data, status: "new", createdAt: fs.serverTimestamp() });
    results.push(true);
  } catch (err) {
    console.error("Lead could not be saved to Firestore", err);
    results.push(false);
  }

  if (site.leadWebhook) {
    try {
      const res = await fetch(site.leadWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submittedAt: new Date().toISOString(), source: site.name }),
      });
      results.push(res.ok);
    } catch {
      results.push(false);
    }
  }

  if (!results.some(Boolean)) throw new Error("Lead submission failed");
  track("generate_lead", { form: payload.intent, challenge: payload.challenge, budget: payload.budget });
}
