import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  budgetOptions,
  challengeOptions,
  channelOptions,
  strategyCallSchema,
  type StrategyCallValues,
} from "@/lib/validation";
import { industries } from "@/data/industries";
import { submitLead } from "@/lib/leads";
import { track } from "@/lib/analytics";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Honeypot, SelectField, TextAreaField, TextField } from "./Field";

const industryOptions = [...industries.map((i) => i.name), "Other"];
const steps = ["Your business", "Your goals", "Your details"] as const;
const stepFields: (keyof StrategyCallValues)[][] = [
  ["company", "website", "industry"],
  ["challenge", "channels", "budget", "outcome"],
  ["name", "email", "phone"],
];

export function StrategyCallForm() {
  const [step, setStep] = useState(0);
  const [failed, setFailed] = useState(false);
  const started = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StrategyCallValues>({
    resolver: zodResolver(strategyCallSchema),
    defaultValues: { channels: [] },
    mode: "onTouched",
  });

  const challenge = watch("challenge");
  const channels = watch("channels") ?? [];

  const markStart = () => {
    if (!started.current) {
      started.current = true;
      track("form_start", { form: "strategy-call" });
    }
  };

  const go = async (dir: 1 | -1) => {
    if (dir === 1) {
      const ok = await trigger(stepFields[step]);
      if (!ok) return;
    }
    setStep((s) => Math.min(steps.length - 1, Math.max(0, s + dir)));
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const onSubmit = async (values: StrategyCallValues) => {
    setFailed(false);
    if (values.hp) {
      navigate("/thank-you");
      return;
    }
    try {
      await submitLead({
        intent: "strategy-call",
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company,
        website: values.website,
        industry: values.industry,
        channels: values.channels,
        budget: values.budget,
        challenge: values.challenge,
        outcome: values.outcome,
      });
      navigate("/thank-you", { state: { name: values.name.split(" ")[0], intent: "strategy-call" } });
    } catch {
      setFailed(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocus={markStart}
      onKeyDown={(e) => {
        if (e.key === "Enter" && step < steps.length - 1 && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLButtonElement)) {
          e.preventDefault();
          void go(1);
        }
      }}
      noValidate aria-describedby="form-progress" className="relative">
      <Honeypot {...register("hp")} />

      {/* Progress */}
      <div id="form-progress" className="mb-10">
        <p className="sr-only">
          Step {step + 1} of {steps.length}: {steps[step]}
        </p>
        <ol className="grid grid-cols-3 gap-2" aria-hidden="true">
          {steps.map((s, i) => (
            <li key={s}>
              <span className={cn("block h-[2px] transition-colors duration-300", i <= step ? "bg-forest" : "bg-ink/15")} />
              <span className={cn("mt-3 block text-xs uppercase tracking-[0.14em]", i === step ? "text-ink" : "text-ink-soft")}>
                <span className="tabular-nums">0{i + 1}</span>
                <span className="ml-2 hidden sm:inline">{s}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="font-display text-display-sm text-ink outline-none">
        {step === 0 && "Tell us about your business."}
        {step === 1 && "Where is growth getting stuck?"}
        {step === 2 && "Where should we reach you?"}
      </h2>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 space-y-6"
        >
          {step === 0 && (
            <>
              <TextField id="company" label="Company" autoComplete="organization" error={errors.company?.message} {...register("company")} />
              <TextField
                id="website"
                label="Website"
                optional
                inputMode="url"
                autoComplete="url"
                placeholder="yourbrand.com"
                error={errors.website?.message}
                {...register("website")}
              />
              <SelectField id="industry" label="Industry" optional options={industryOptions} error={errors.industry?.message} {...register("industry")} />
            </>
          )}

          {step === 1 && (
            <>
              <fieldset>
                <legend className="mb-3 text-sm font-medium text-ink">Main growth challenge</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {challengeOptions.map((c) => (
                    <label
                      key={c}
                      className={cn(
                        "flex min-h-[52px] cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-[0.95rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold",
                        challenge === c ? "border-forest bg-forest text-ivory" : "border-ink/20 bg-ivory-50 text-ink hover:border-ink/50"
                      )}
                    >
                      <input type="radio" value={c} className="sr-only" {...register("challenge")} />
                      <span aria-hidden="true" className={cn("h-3 w-3 shrink-0 rounded-full border", challenge === c ? "border-gold bg-gold" : "border-ink/40")} />
                      {c}
                    </label>
                  ))}
                </div>
                {errors.challenge && (
                  <p role="alert" className="mt-2 text-sm text-[#9B2C2C]">
                    {errors.challenge.message}
                  </p>
                )}
              </fieldset>

              <fieldset>
                <legend className="mb-3 flex w-full items-baseline justify-between text-sm font-medium text-ink">
                  <span>Current marketing channels</span>
                  <span className="text-xs font-normal text-ink-soft">Optional · select any</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {channelOptions.map((c) => {
                    const on = channels.includes(c);
                    return (
                      <label
                        key={c}
                        className={cn(
                          "inline-flex min-h-[42px] cursor-pointer items-center rounded-sm border px-3.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold",
                          on ? "border-forest bg-sage text-ink" : "border-ink/20 bg-ivory-50 text-ink-muted hover:border-ink/50"
                        )}
                      >
                        <input type="checkbox" value={c} className="sr-only" {...register("channels")} />
                        {on && <span aria-hidden="true" className="mr-2 text-forest">✓</span>}
                        {c}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <SelectField id="budget" label="Monthly marketing budget" optional options={budgetOptions} hint="Including ad spend. Helps us suggest a realistic plan." {...register("budget")} />
              <TextAreaField
                id="outcome"
                label="What would a great outcome look like in 12 months?"
                optional
                rows={4}
                placeholder="e.g. 40 qualified enquiries a month, a clear view of marketing ROI…"
                error={errors.outcome?.message}
                {...register("outcome")}
              />
            </>
          )}

          {step === 2 && (
            <>
              <TextField id="name" label="Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
              <TextField id="email" label="Work email" type="email" autoComplete="email" inputMode="email" error={errors.email?.message} {...register("email")} />
              <TextField
                id="phone"
                label="Phone or WhatsApp"
                type="tel"
                optional
                autoComplete="tel"
                inputMode="tel"
                placeholder="+91 …"
                error={errors.phone?.message}
                {...register("phone")}
              />
              <p className="text-sm text-ink-soft">
                We'll use these details only to arrange your call. See our{" "}
                <a href="/privacy" className="underline decoration-gold underline-offset-4">
                  privacy policy
                </a>
                .
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {failed && (
        <div role="alert" className="mt-8 rounded-sm border border-[#9B2C2C]/40 bg-[#9B2C2C]/5 p-4 text-sm text-ink">
          Something went wrong sending your request. Please try again, or{" "}
          <a href={site.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="underline">
            message us on WhatsApp
          </a>
          .
        </div>
      )}

      <div className="mt-10 flex flex-col-reverse gap-4 border-t border-ink/15 pt-8 xs:flex-row xs:items-center xs:justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => go(-1)} className="min-h-[44px] text-left text-ink-muted hover:text-ink">
            ← Back
          </button>
        ) : (
          <span className="text-sm text-ink-soft">Takes about a minute.</span>
        )}
        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => go(1)} size="lg">
            Continue
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Request my strategy call"}
          </Button>
        )}
      </div>
    </form>
  );
}
