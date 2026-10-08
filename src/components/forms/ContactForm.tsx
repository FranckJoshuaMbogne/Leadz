import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generalContactSchema, type GeneralContactValues } from "@/lib/validation";
import { submitLead } from "@/lib/leads";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Honeypot, TextAreaField, TextField } from "./Field";

export function ContactForm() {
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GeneralContactValues>({ resolver: zodResolver(generalContactSchema), mode: "onTouched" });

  const onSubmit = async (v: GeneralContactValues) => {
    setFailed(false);
    if (v.hp) return navigate("/thank-you");
    try {
      await submitLead({ intent: "general", name: v.name, email: v.email, company: v.company, message: v.message });
      navigate("/thank-you", { state: { name: v.name.split(" ")[0], intent: "general" } });
    } catch {
      setFailed(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-6">
      <Honeypot {...register("hp")} />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="c-name" label="Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
        <TextField id="c-email" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      </div>
      <TextField id="c-company" label="Company" optional autoComplete="organization" {...register("company")} />
      <TextAreaField id="c-message" label="How can we help?" rows={5} error={errors.message?.message} {...register("message")} />
      {failed && (
        <p role="alert" className="rounded-sm border border-[#9B2C2C]/40 bg-[#9B2C2C]/5 p-4 text-sm text-ink">
          Your message could not be sent. Please try again or{" "}
          <a href={site.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="underline">
            message us on WhatsApp
          </a>
          .
        </p>
      )}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
