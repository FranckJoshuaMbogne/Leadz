import { Container } from "@/components/ui/Container";
import { useSEO } from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

export function Pricing() {
  useSEO("Pricing — Leadz.in", "Bundles and plans for websites, CRM, landing pages, and full-funnel packages.");

  const bundles = [
    {
      title: "Starter",
      price: "$1,200",
      bullets: ["1 landing page", "CRM setup (basic)", "1-week support"],
    },
    {
      title: "Growth",
      price: "$3,500",
      bullets: ["3 landing pages", "CRM setup + automations", "2 weeks support"],
    },
    {
      title: "Scale",
      price: "$7,500",
      bullets: ["Custom website", "Full CRM + integrations", "Ongoing optimization"],
    },
  ];

  return (
    <main>
      <section className="section-y">
        <Container className="text-center">
          <h1 className="text-display-lg font-display font-bold text-ink">Pricing & Plans</h1>
          <p className="mt-4 text-silver">Choose a bundle to get started — all plans are custom scoped.</p>
        </Container>
      </section>

      <section className="section-y bg-elevated">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bundles.map((b) => (
              <motion.div key={b.title} whileHover={{ y: -6 }} className="rounded-card bg-white/[0.03] p-6">
                <h3 className="text-base font-semibold text-ink">{b.title}</h3>
                <p className="mt-3 text-2xl font-bold text-white">{b.price}</p>
                <ul className="mt-4 space-y-2 text-sm text-silver">
                  {b.bullets.map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link to="/contact">
                    <Button variant="secondary">Choose {b.title}</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}

export default Pricing;
