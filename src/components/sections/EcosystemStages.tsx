import { Link } from "react-router-dom";
import { catalog, stages } from "@/data/catalog";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** The 360° ecosystem explained in four plain stages, each listing its services. */
export function EcosystemStages({ title, intro }: { title?: React.ReactNode; intro?: string }) {
  return (
    <section aria-labelledby="eco-title" className="on-dark bg-forest py-section text-ivory">
      <div className="container-site">
        <SectionHeader
          light
          eyebrow="The 360° ecosystem"
          title={<span id="eco-title">{title ?? <>Every step from first look <em>to closed sale.</em></>}</span>}
          intro={intro ?? "Most agencies stop at likes or clicks. We connect everything that turns a stranger into a paying customer — and keeps them coming back."}
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-lg border border-ivory/15 bg-ivory/15 md:grid-cols-2 lg:grid-cols-4">
          {stages.map((st, i) => (
            <Reveal as="li" key={st.key} delay={i * 0.06} className="relative bg-forest p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-semibold text-deep">{i + 1}</span>
                <h3 className="font-display text-xl">{st.title}</h3>
              </div>
              <p className="mt-3 text-sm text-ivory/70">{st.text}</p>
              <ul className="mt-5 space-y-2 border-t border-ivory/15 pt-5 text-[0.95rem]">
                {catalog
                  .filter((c) => c.stage === st.key)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link to={`/services/${c.slug}`} className="link-underline text-ivory/90 hover:text-ivory">
                        {c.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
