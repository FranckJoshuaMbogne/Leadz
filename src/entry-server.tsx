import { StrictMode } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { HeadProvider, buildHeadTags, headTagsToString, type HeadCollector } from "./lib/seo";
import { InsightsProvider } from "./lib/insights";
import { ContentProvider, type InitialContent } from "./content/ContentProvider";
import type { Insight } from "./data/insights";

export { staticInsights } from "./data/insights";
export { defaultContent, mergeContent } from "./content/defaults";
export { site } from "./config/site";
export { docToInsight } from "./lib/insights";
export { buildHeadTags, headTagsToString, courseLd, courseListLd, breadcrumbLd } from "./lib/seo";
export { builtInPages, normalizePage } from "./landing/defaults";

export async function render(url: string, cmsInsights: Insight[], initial: InitialContent) {
  const collector: HeadCollector = {};
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <HeadProvider collector={collector}>
        <ContentProvider initial={initial} live={false}>
          <InsightsProvider initial={cmsInsights}>
            <StaticRouter location={url}>
              <App />
            </StaticRouter>
          </InsightsProvider>
        </ContentProvider>
      </HeadProvider>
    </StrictMode>
  );
  const html = await new Promise<string>((resolve, reject) => {
    let out = "";
    prelude.setEncoding("utf8");
    prelude.on("data", (c: string) => (out += c));
    prelude.on("end", () => resolve(out));
    prelude.on("error", reject);
  });
  const head = collector.data ? headTagsToString(buildHeadTags(collector.data)) : "";
  return { html, head, status: collector.status ?? 200 };
}
