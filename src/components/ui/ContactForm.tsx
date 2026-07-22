import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation";
import { serviceOptions } from "@/data/contact";

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-silver/50 focus:border-electric focus:outline-none";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [detectedCode] = useState(() => {
    try {
      const lang = navigator.language || (navigator as any).userLanguage || "en-US";
      if (/in|india/i.test(lang)) return "+91";
      if (/gb|uk|en-?gb/i.test(lang)) return "+44";
      if (/us|en-?us/i.test(lang)) return "+1";
      return "+91";
    } catch {
      return "+91";
    }
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (data: ContactFormValues) => {
    const WEBHOOK = (import.meta as any).env.VITE_WEBHOOK_URL || "https://example.com/webhook";

    // Save to localStorage for admin dashboard
    try {
      const existing = JSON.parse(localStorage.getItem("contact_submissions") || "[]");
      existing.unshift({ ...data, createdAt: new Date().toISOString() });
      localStorage.setItem("contact_submissions", JSON.stringify(existing));
    } catch (e) {
      // ignore
    }

    // Send minimal payload (includes selected service prominently)
    try {
      await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: `${data.countryCode || ""} ${data.phone || ""}`.trim(),
          service: data.service,
          city: data.city,
          country: data.country,
          message: data.message,
        }),
      });
    } catch (e) {
      // network errors are non-fatal for now
    }

    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-full flex-col items-center justify-center py-16 text-center"
      >
        <CheckCircle2 size={40} className="text-electric" />
        <h3 className="mt-4 text-lg font-semibold text-ink">Booking requested</h3>
        <p className="mt-2 max-w-xs text-sm text-silver">
          Thanks — a strategist will reach out within one business day to schedule your booking.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm font-medium text-electric hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
            Full name
          </label>
          <input id="name" className={inputClass} {...register("name")} />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="mt-1.5 text-xs text-red-400"
              >
                {errors.name.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input id="email" type="email" className={inputClass} {...register("email")} />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="mt-1.5 text-xs text-red-400"
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
            Phone
          </label>
          <div className="flex items-stretch gap-2">
            <select
              {...register("countryCode")}
              defaultValue={detectedCode}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-ink"
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+61">+61</option>
            </select>
            <input id="phone" type="tel" className={inputClass + " flex-1"} {...register("phone")} />
          </div>
          <AnimatePresence>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="mt-1.5 text-xs text-red-400"
              >
                {errors.phone.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-ink">
            Company <span className="text-silver">(optional)</span>
          </label>
          <input id="company" className={inputClass} {...register("company")} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-ink">
            City
          </label>
          <input id="city" className={inputClass} {...register("city")} />
        </div>

        <div>
          <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-ink">
            Country
          </label>
          <input id="country" className={inputClass} {...register("country")} />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-ink">
          What are you interested in?
        </label>
        <select
          id="service"
          defaultValue=""
          className={cn(inputClass, "appearance-none")}
          {...register("service")}
        >
          <option value="" disabled>
            Select an option
          </option>
          {serviceOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-elevated">
              {opt}
            </option>
          ))}
        </select>
        <AnimatePresence>
          {errors.service && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="mt-1.5 text-xs text-red-400"
            >
              {errors.service.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          className={inputClass}
          placeholder="Tell us a bit about your business and goals..."
          {...register("message")}
        />
        <AnimatePresence>
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="mt-1.5 text-xs text-red-400"
            >
              {errors.message.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Booking..." : "Book Now"} <Send size={16} />
      </Button>
    </form>
  );
}
