import { FaqList } from "@/components/sections/FaqList";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonA } from "@/components/ui/Button";
import { site } from "@/config/site";

export function FaqSection({ faqs, title = "Questions, answered" }: { faqs: { question: string; answer: string }[]; title?: string }) {
  return (
    <section aria-labelledby="faq-title" className="bg-ivory py-section">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="faq-title" className="mt-6 font-display text-display-md text-ink">
            {title}
          </h2>
          <p className="mt-4 text-ink-muted">Something else on your mind? Ask us directly.</p>
          <ButtonA href={site.contact.whatsappHref} target="_blank" rel="noopener noreferrer" variant="outline" className="mt-6" arrow={false}>
            Ask on WhatsApp
          </ButtonA>
        </div>
        <div className="lg:col-span-8">
          <FaqList faqs={faqs} />
        </div>
      </div>
    </section>
  );
}
