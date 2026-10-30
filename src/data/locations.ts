import type { ArtVariant } from "@/components/art/CoverArt";

/**
 * City pages for local search (springs360.in/locations/<slug>).
 * Edited in /admin → Locations (local SEO).
 *
 * Only fill `address` with a real office or registered address: Google
 * penalises listings with addresses a business doesn't operate from.
 * Without an address, the structured data describes the city as an area served.
 */
export interface Location {
  slug: string;
  published?: boolean;
  /** City name as people search it, e.g. "Hyderabad". */
  city: string;
  /** State or region, e.g. "Telangana". */
  region: string;
  /** Cities and towns covered by this page (structured data `areaServed`). */
  cities: string[];
  /** Neighbourhoods and business districts mentioned on the page. */
  areas: string[];
  seoTitle: string;
  seoDescription: string;
  /** Hero lines. Wrap words in *asterisks* for the accent italic. */
  headline: string[];
  intro: string;
  /** "Marketing in <city>: what works" paragraphs. */
  context: string[];
  services: string[]; // service slugs
  faqs: { question: string; answer: string }[];
  geo: { lat: number; lng: number };
  address?: { street: string; locality: string; postalCode: string };
  /** Optional local phone number; otherwise the main number is used. */
  phone?: string;
  /** Google Maps link of the Google Business Profile, if there is one for this city. */
  mapsUrl?: string;
  image?: string;
  art: ArtVariant;
}

const core = ["local-seo", "google-business-profile", "google-ads", "meta-ads", "website-development", "social-media-management", "whatsapp-automation", "crm-automation"];

export const locations: Location[] = [
  {
    slug: "hyderabad",
    city: "Hyderabad",
    region: "Telangana",
    cities: ["Hyderabad", "Secunderabad", "Cyberabad"],
    areas: ["Hitech City", "Madhapur", "Gachibowli", "Kondapur", "Kukatpally", "Jubilee Hills", "Banjara Hills", "Ameerpet", "Begumpet", "Secunderabad", "Kompally", "Manikonda", "Attapur", "Dilsukhnagar", "LB Nagar", "Uppal"],
    seoTitle: "Digital Marketing Agency in Hyderabad",
    seoDescription:
      "Springs 360 is a 360° digital marketing agency in Hyderabad: Google Ads, Meta Ads, local SEO, websites, social media and WhatsApp lead follow-up for businesses in Hitech City, Gachibowli, Jubilee Hills and across the city.",
    headline: ["Digital marketing agency", "in *Hyderabad.*"],
    intro:
      "One team for your ads, Google ranking, website, social media and lead follow-up, built for Hyderabad businesses that want more calls, bookings and walk-ins.",
    context: [
      "Hyderabad customers search by area. People look for a dentist in Kondapur, a salon in Jubilee Hills or interiors in Gachibowli, so we build campaigns and Google Business Profiles around the neighbourhoods you actually serve, not the whole city.",
      "Most local enquiries here arrive on WhatsApp and phone. We connect your ads and website to WhatsApp, answer every enquiry fast and track which campaign brought each customer, so you can see what each booking costs.",
      "Competition on Google Ads is high in Hitech City, Madhapur and Gachibowli. We combine search ads with local SEO and reviews so you aren't paying for every single lead.",
    ],
    services: core,
    faqs: [
      { question: "Do you work with small businesses in Hyderabad?", answer: "Yes. Most of our work is with clinics, salons, home services, interior designers, coaching centres, restaurants and retail stores across Hyderabad and Secunderabad." },
      { question: "How do you get my business on top of Google Maps in my area?", answer: "We complete and optimise your Google Business Profile, add the services and areas you cover, build a steady flow of genuine reviews and create local pages on your website. Rankings depend on your distance from the searcher, your relevance and your reputation, so results grow over a few months." },
      { question: "Can we meet in person?", answer: "Yes, we can meet in Hyderabad. Most of the day-to-day work happens on WhatsApp and video calls, with a simple monthly report." },
      { question: "How much should I spend on ads in Hyderabad?", answer: "It depends on your service and area. Many local businesses start between ₹15,000 and ₹50,000 a month in ad spend. Take the free growth audit and we'll suggest a budget for your goals." },
    ],
    geo: { lat: 17.385, lng: 78.4867 },
    art: "contour",
  },
  {
    slug: "bengaluru",
    city: "Bengaluru",
    region: "Karnataka",
    cities: ["Bengaluru", "Bangalore"],
    areas: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Electronic City", "Marathahalli", "Bellandur", "Sarjapur Road", "Jayanagar", "JP Nagar", "BTM Layout", "Hebbal", "Yelahanka", "Malleshwaram", "Rajajinagar"],
    seoTitle: "Digital Marketing Agency in Bengaluru (Bangalore)",
    seoDescription:
      "Springs 360 is a 360° digital marketing agency for Bengaluru businesses: Google Ads, Meta Ads, local SEO, websites, social media and WhatsApp automation for Koramangala, Indiranagar, HSR Layout, Whitefield and beyond.",
    headline: ["Digital marketing agency", "in *Bengaluru.*"],
    intro:
      "Ads, Google ranking, websites, content and lead follow-up handled by one team, for Bengaluru businesses that want customers, not just clicks.",
    context: [
      "Bengaluru is spread out and traffic decides where people go. Customers pick businesses close to them, so we target by locality, such as Koramangala, HSR Layout or Whitefield, and show your nearest branch in every ad and listing.",
      "Your customers here compare options online before they call. A fast website, real reviews and clear prices on Google win more enquiries than a bigger ad budget alone.",
      "Many Bengaluru buyers book online. We set up booking links, WhatsApp replies and follow-up messages so enquiries turn into appointments without extra staff.",
    ],
    services: core,
    faqs: [
      { question: "Do you serve businesses across Bengaluru?", answer: "Yes. We run campaigns for every part of Bengaluru, from Whitefield and Electronic City to Yelahanka and Jayanagar, and target each campaign at the areas you serve." },
      { question: "Do I need to be in Bengaluru to work with you?", answer: "No. We work with Bengaluru businesses remotely on WhatsApp and video calls, with a clear monthly report on leads, customers and cost." },
      { question: "Is local SEO or Google Ads better for Bengaluru?", answer: "Google Ads brings enquiries quickly; local SEO lowers your cost over time. Most businesses do best with both. The free audit shows which one to start with for you." },
      { question: "What happens in the first month?", answer: "We audit your Google profile, website and ads, fix what's costing you enquiries, launch your first campaigns and set up WhatsApp follow-up. You get a report on leads and cost at the end of the month." },
    ],
    geo: { lat: 12.9716, lng: 77.5946 },
    art: "flow",
  },
  {
    slug: "delhi-ncr",
    city: "Delhi NCR",
    region: "Delhi",
    cities: ["New Delhi", "Delhi", "Noida", "Greater Noida", "Gurugram", "Ghaziabad", "Faridabad"],
    areas: ["Connaught Place", "South Delhi", "Saket", "Lajpat Nagar", "Karol Bagh", "Dwarka", "Rohini", "Janakpuri", "Noida", "Greater Noida", "Gurugram Cyber City", "Golf Course Road", "Sohna Road", "Ghaziabad", "Faridabad"],
    seoTitle: "Digital Marketing Agency in Delhi NCR (Delhi, Noida, Gurugram)",
    seoDescription:
      "Springs 360 is a 360° digital marketing agency for Delhi NCR: Google Ads, Meta Ads, local SEO, websites, social media and WhatsApp lead follow-up for businesses in Delhi, Noida, Gurugram, Ghaziabad and Faridabad.",
    headline: ["Digital marketing agency", "for *Delhi NCR.*"],
    intro:
      "One team for ads, Google ranking, websites, content and lead follow-up, for businesses in Delhi, Noida, Gurugram, Ghaziabad and Faridabad.",
    context: [
      "Delhi NCR is several markets in one. Someone in Gurugram rarely travels to Dwarka, so we split campaigns and Google listings by city and locality and spend where your customers really are.",
      "Advertising costs in NCR are among the highest in India. Tight targeting, landing pages for each service and quick WhatsApp replies keep your cost per customer down.",
      "Customers here compare many providers. Reviews, before-and-after proof and clear offers are what make them call you first, so we build those into your profile, website and ads.",
    ],
    services: core,
    faqs: [
      { question: "Which parts of Delhi NCR do you cover?", answer: "All of NCR: Delhi, Noida, Greater Noida, Gurugram, Ghaziabad and Faridabad. Each campaign targets the areas your business serves." },
      { question: "Can you manage several branches across NCR?", answer: "Yes. We set up a Google Business Profile and local page for each branch and route every enquiry to the right location." },
      { question: "How fast will I get leads in Delhi NCR?", answer: "Search ads usually bring the first enquiries within days of launch. Local SEO builds over two to four months. We report leads and cost per customer every month." },
      { question: "Do you work remotely with NCR businesses?", answer: "Yes. We work over WhatsApp and video calls, and every campaign is managed by the same team." },
    ],
    geo: { lat: 28.6139, lng: 77.209 },
    art: "rings",
  },
];
