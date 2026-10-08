import { Link, useParams } from "react-router-dom";
import { Seo, articleLd, breadcrumbLd } from "@/lib/seo";
import { useInsights } from "@/lib/insights";
import { insightContent } from "@/data/insights/content";
import { getService, getPillar } from "@/data/services";
import { Markdown, headingsOf } from "@/lib/markdown";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { InsightCard, InsightCover } from "@/components/cards/InsightCard";
import { MaskText } from "@/components/animations/MaskText";
import { Reveal } from "@/components/animations/Reveal";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { formatDate } from "@/lib/utils";
import NotFound from "./NotFound";

export default function Article() {
  const { slug = "" } = useParams();
  const { insights, live } = useInsights({ live: true });
  const meta = insights.find((i) => i.slug === slug);
  const content = meta?.content ?? insightContent[slug];

  if (!meta || !content) {
    if (!live) return <div className="min-h-screen bg-deep" aria-busy="true" />;
    return <NotFound />;
  }

  const path = `/insights/${meta.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: meta.title, path },
  ];
  const toc = headingsOf(content);
  const service = meta.relatedService ? getService(meta.relatedService) : undefined;
  const pillar = service ? getPillar(service.pillar) : meta.relatedService ? getPillar(meta.relatedService) : undefined;
  const related = insights
    .filter((i) => i.slug !== meta.slug)
    .sort((a, b) => Number(b.category === meta.category) - Number(a.category === meta.category))
    .slice(0, 3);

  return (
    <>
      <Seo
        title={meta.seoTitle || meta.title}
        description={meta.seoDescription || meta.excerpt}
        path={path}
        type="article"
        image={meta.coverImage}
        imageAlt={meta.coverAlt}
        article={{ publishedTime: meta.publishedAt, modifiedTime: meta.updatedAt, section: meta.category }}
        jsonLd={[
          articleLd({
            title: meta.title,
            description: meta.seoDescription || meta.excerpt,
            path,
            image: meta.coverImage,
            publishedAt: meta.publishedAt,
            updatedAt: meta.updatedAt,
            author: meta.author,
            category: meta.category,
          }),
          breadcrumbLd(crumbs),
        ]}
      />

      <article>
        <header className="on-dark bg-deep text-ivory">
          <div className="container-site pb-12 pt-32 md:pt-44">
            <Breadcrumbs items={crumbs.slice(0, 2)} light className="anim-fade-up mb-10" />
            <p className="anim-fade-up eyebrow text-gold-light" style={{ animationDelay: "0.05s" }}>
              <Link to={`/insights?category=${encodeURIComponent(meta.category)}`} className="hover:text-ivory">
                {meta.category}
              </Link>
            </p>
            <h1 className="mt-6 max-w-5xl font-display text-display-lg">
              <MaskText lines={[meta.title]} delay={0.1} />
            </h1>
            <p className="anim-fade-up mt-8 max-w-3xl text-lead text-ivory/75" style={{ animationDelay: "0.3s" }}>
              {meta.excerpt}
            </p>
            <div className="anim-fade-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ivory/15 pt-6 text-sm text-ivory/70" style={{ animationDelay: "0.4s" }}>
              <span>
                By <span className="text-ivory">{meta.author}</span>
              </span>
              <time dateTime={meta.publishedAt}>{formatDate(meta.publishedAt)}</time>
              {meta.updatedAt && meta.updatedAt !== meta.publishedAt && <span>Updated {formatDate(meta.updatedAt)}</span>}
              <span>{meta.readingMinutes} min read</span>
            </div>
          </div>
          <div className="container-site">
            <InsightCover insight={meta} eager className="aspect-[16/9] rounded-b-none md:aspect-[21/9]" />
          </div>
        </header>

        <div className="bg-ivory py-section-sm">
          <div className="container-site grid gap-12 lg:grid-cols-12">
            {toc.length > 2 && (
              <aside className="hidden lg:col-span-3 lg:block">
                <nav aria-label="In this article" className="sticky top-28">
                  <p className="eyebrow text-ink-muted">In this article</p>
                  <ol className="mt-5 space-y-3 border-l border-ink/15 text-sm">
                    {toc.map((h) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-ink-muted hover:border-gold hover:text-ink">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>
            )}
            <div className={toc.length > 2 ? "lg:col-span-8 lg:col-start-5" : "lg:col-span-8 lg:col-start-3"}>
              <div className="prose-editorial max-w-prose">
                <Markdown source={content} />
              </div>

              {(service || pillar) && (
                <Reveal className="mt-16 max-w-prose rounded bg-sage-100 p-7 sm:p-9">
                  <p className="eyebrow text-ink-muted">Related service</p>
                  <p className="mt-4 font-display text-display-sm text-ink">{service?.name ?? pillar?.name}</p>
                  <p className="mt-3 text-ink-muted">{service?.short ?? pillar?.summary}</p>
                  <Link
                    to={`/services/${service?.slug ?? pillar?.slug}`}
                    className="group/btn mt-6 inline-flex items-center gap-3 font-medium text-ink"
                  >
                    <span className="link-underline">How we help</span> <Arrow />
                  </Link>
                </Reveal>
              )}

              <div className="mt-12 flex max-w-prose flex-col gap-4 border-t border-ink/15 pt-8 xs:flex-row xs:items-center xs:justify-between">
                <p className="text-ink-muted">Want to apply this to your business?</p>
                <ButtonLink to="/book" variant="primary">
                  Talk to a Growth Strategist
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related" className="bg-ivory-200 py-section-sm">
          <div className="container-site">
            <div className="flex items-end justify-between">
              <h2 id="related" className="font-display text-display-md text-ink">
                Keep reading
              </h2>
              <ButtonLink to="/insights" variant="text" className="hidden sm:inline-flex">
                All insights
              </ButtonLink>
            </div>
            <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
              {related.map((r) => (
                <InsightCard key={r.slug} insight={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand eyebrow="Put it into practice" title="Talk to a growth strategist." cta="Talk to a Growth Strategist" />
    </>
  );
}
