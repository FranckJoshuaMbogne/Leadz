import { Seo } from "@/lib/seo";
import { site } from "@/config/site";
import { PageHero } from "@/components/sections/PageHero";
import { Markdown } from "@/lib/markdown";

/*
 * Plain-language policies describing how this website actually handles data.
 * They should be reviewed by a qualified lawyer before launch and updated
 * whenever tools (analytics, CRM, webhooks) change.
 */

const UPDATED = "7 October 2026";

const contactLine = site.contact.email
  ? `email [${site.contact.email}](mailto:${site.contact.email}) or call ${site.contact.phoneDisplay}`
  : `call or WhatsApp us on ${site.contact.phoneDisplay}, or use our [contact page](/contact)`;

const privacy = `
This policy explains what personal information ${site.name} collects through this website, why, and what choices you have.

## Information we collect

**Information you give us.** When you book a strategy call or send a message, we collect the details you enter — such as your name, email address, phone or WhatsApp number, company, website, industry, marketing channels, budget range, growth challenge and message.

**Technical information.** Our hosting provider processes standard technical data (such as IP address, browser type and pages requested) to deliver and secure the website. If we enable analytics or advertising measurement tools, they may collect information about how you use the site; where required, we will ask for your consent first.

## How we use it

- To respond to your enquiry and arrange any call you request
- To prepare for and follow up on conversations about working together
- To operate, secure and improve this website
- To meet legal obligations

We do not sell your personal information.

## Where it is stored

Form submissions are stored in Google Firebase (Cloud Firestore), operated by Google. We may also pass enquiries to the customer relationship management (CRM) tools we use to manage conversations. These providers process data on our behalf and under their own security commitments.

## How long we keep it

We keep enquiry information for as long as needed to respond and to maintain a record of our conversations, and delete it when it is no longer required, unless we must keep it for legal reasons.

## Your choices and rights

You can ask us to access, correct or delete the personal information we hold about you, or to stop contacting you, at any time. Depending on where you live, you may have additional rights under applicable data-protection law.

## Contact

For any privacy question or request, ${contactLine}.

We may update this policy as our website and tools change. The date below shows when it was last revised.
`;

const terms = `
These terms apply to your use of the ${site.name} website. By using the site you agree to them.

## Use of the website

You may use this website for lawful purposes only. You must not attempt to disrupt the site, gain unauthorised access to any part of it, or use it to send unsolicited or harmful content.

## Content

The articles, insights and other content on this website are provided for general information. They are not professional, legal or financial advice for your specific situation. Examples marked "Illustrative" are representative scenarios, not results achieved for a named client.

Unless stated otherwise, the design, text and graphics on this site belong to ${site.name}. You may share links to our pages and quote short extracts with attribution.

## Services

Information on this website does not form an offer or contract. Any engagement with ${site.name} is governed by a separate written agreement.

## Third-party links

This site may link to websites we do not control. We are not responsible for their content or practices.

## Liability

We take care to keep this website accurate and available, but we do not guarantee that it will always be error-free or uninterrupted. To the extent permitted by law, we are not liable for losses arising from use of this website.

## Changes

We may update these terms from time to time. Continued use of the site after changes means you accept the updated terms.

## Contact

Questions about these terms? Please ${contactLine}.
`;

export default function Legal({ page }: { page: "privacy" | "terms" }) {
  const isPrivacy = page === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms of Use";
  return (
    <>
      <Seo
        title={title}
        description={isPrivacy ? `How ${site.name} collects, uses and protects personal information.` : `Terms governing the use of the ${site.name} website.`}
        path={`/${page}`}
      />
      <PageHero
        eyebrow="Legal"
        titleLines={[title]}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: title, path: `/${page}` },
        ]}
      />
      <section className="bg-ivory py-section-sm">
        <div className="container-site">
          <div className="prose-editorial mx-auto max-w-prose">
            <Markdown source={isPrivacy ? privacy : terms} />
            <p className="text-sm text-ink-soft">Last updated: {UPDATED}</p>
          </div>
        </div>
      </section>
    </>
  );
}
