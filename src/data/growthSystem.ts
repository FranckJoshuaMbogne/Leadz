import type { StageKey } from "./catalog";

export interface GrowthStage {
  key: StageKey;
  index: string;
  name: string;
  verb: string;
  description: string;
  question: string;
}

/**
 * The Springs 360 growth wheel — four steps every engagement is built around.
 * The services shown in each step come from src/data/catalog.ts (field `stage`).
 */
export const growthStages: GrowthStage[] = [
  {
    key: "seen",
    index: "01",
    name: "Get seen",
    verb: "Be visible where your customers spend time",
    description:
      "Consistent social media, content, design and a strong Google presence — so the right people notice your brand and remember it.",
    question: "Do the right people see us every week?",
  },
  {
    key: "customers",
    index: "02",
    name: "Get customers",
    verb: "Turn attention into enquiries",
    description:
      "Meta and Google Ads, promotions, websites and landing pages built to bring real enquiries — not just likes and clicks.",
    question: "Are we getting enquiries from people ready to buy?",
  },
  {
    key: "close",
    index: "03",
    name: "Close the sale",
    verb: "Answer fast and follow up every time",
    description:
      "Every lead captured, answered quickly on WhatsApp, email or phone, followed up and guided to a booking or a purchase.",
    question: "What happens to an enquiry in the first hour?",
  },
  {
    key: "grow",
    index: "04",
    name: "Grow what works",
    verb: "Measure, improve, repeat",
    description:
      "Performance management, analysis and clear monthly reports — so budget moves to what brings customers, and results keep improving.",
    question: "Do we know which marketing brings our customers?",
  },
];
