import { z } from "zod";

export const budgetOptions = [
  "Under ₹50,000 / month",
  "₹50,000 – ₹2,00,000 / month",
  "₹2,00,000 – ₹5,00,000 / month",
  "Above ₹5,00,000 / month",
  "Not decided yet",
] as const;

export const channelOptions = [
  "Google Ads",
  "Meta Ads",
  "SEO",
  "Social media",
  "Email / WhatsApp",
  "Referrals only",
  "Nothing consistent yet",
] as const;

export const challengeOptions = [
  "Not enough qualified leads",
  "Leads don't convert to customers",
  "No clear view of what's working",
  "Website or funnel underperforms",
  "Too much manual follow-up",
  "Need a growth strategy",
] as const;

const optionalUrl = z
  .string()
  .trim()
  .max(200)
  .optional()
  .refine((v) => !v || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+.*$/i.test(v), "Enter a valid website, e.g. yourbrand.com");

export const strategyCallSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .refine((v) => !v || /^[+\d][\d\s()-]{6,}$/.test(v), "Enter a valid phone or WhatsApp number"),
  company: z.string().trim().min(1, "Please enter your company").max(120),
  website: optionalUrl,
  industry: z.string().trim().max(80).optional(),
  channels: z.array(z.string()).max(10).optional(),
  budget: z.string().max(60).optional(),
  challenge: z.string({ required_error: "Choose the closest option", invalid_type_error: "Choose the closest option" }).min(1, "Choose the closest option"),
  outcome: z.string().trim().max(1500).optional(),
  // Honeypot — real users never see or fill this.
  hp: z.string().max(0).optional(),
});

export type StrategyCallValues = z.infer<typeof strategyCallSchema>;

export const generalContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(160),
  company: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(1500),
  hp: z.string().max(0).optional(),
});

export type GeneralContactValues = z.infer<typeof generalContactSchema>;
