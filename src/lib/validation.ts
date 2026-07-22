import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  countryCode: z.string().trim().optional(),
  phone: z.string().trim().min(5, "Enter a valid phone number"),
  company: z.string().trim().optional(),
  service: z.string().min(1, "Select what you're interested in"),
  message: z.string().trim().min(10, "Tell us a bit more (10+ characters)"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
