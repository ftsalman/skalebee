// SEO settings for the whole site: one place for titles, descriptions and business details.
// Used in the browser (per-page <head> tags) AND at build time by vite.config.js
// (static tags in index.html, structured data, sitemap.xml and robots.txt).
// Keep this file plain JS (no JSX, no "@/..." imports) so vite.config.js can import it.

// IMPORTANT: set your real domain in .env.production -> VITE_SITE_URL=https://www.yourdomain.com
const FALLBACK_SITE_URL = "https://www.skalebee.com";

export const getSiteUrl = (env) =>
  (env?.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, "");

export const SITE = {
  name: "Skalebee",
  // Shown in Google results as "Page title | Skalebee"
  titleTemplate: "%s | Skalebee",
  defaultTitle: "Skalebee | Meta Ads, Google Ads & Digital Marketing Agency in India",
  description:
    "Skalebee is a Meta Business Partner and digital marketing agency in India. Meta Ads, Google Ads, SEO, websites and WhatsApp automation, from the first lead to the final sale.",
  keywords: [
    "digital marketing agency India",
    "Meta Ads agency",
    "Facebook ads agency",
    "Instagram ads",
    "Google Ads agency",
    "performance marketing",
    "SEO services",
    "website development",
    "WhatsApp automation",
    "Shopify store development",
    "lead generation",
  ],
  locale: "en_IN",
  themeColor: "#ffd400",
  // Social share image (1200 x 630). Captured from the hero; replace with your own if you like.
  ogImage: "/og-image.jpg",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Skalebee: Scale ads that make buzz. Book a call or get a free proposal.",
  logo: "/svgs/logo-stacked.svg",
  twitterHandle: "", // e.g. "@skalebee"

  // Business details for Google's structured data (Knowledge Panel / rich results).
  business: {
    type: "ProfessionalService",
    email: "", // e.g. "hello@skalebee.com"
    telephone: "", // e.g. "+91 98765 43210"
    country: "IN",
    region: "", // e.g. "Kerala"
    city: "", // e.g. "Kochi"
    areaServed: "Worldwide",
    foundingYear: "2024",
    // Full URLs of your real social profiles (Instagram, LinkedIn, Facebook, YouTube...)
    sameAs: [],
  },
};

// Per-route metadata. `path` must match the router. `noindex` keeps a page out of Google.
export const PAGES = {
  "/": {
    title: SITE.defaultTitle,
    absoluteTitle: true,
    description: SITE.description,
    changefreq: "weekly",
    priority: 1.0,
  },
  "/about": {
    // Placeholder page: remove `noindex` once it has real content.
    noindex: true,
    title: "About Us",
    description:
      "Meet Skalebee: a Meta certified team helping brands grow with Meta Ads, Google Ads, SEO, websites and WhatsApp automation.",
    changefreq: "monthly",
    priority: 0.8,
  },
  "/contact": {
    title: "Contact Us: Send a Brief in 4 Quick Steps",
    description:
      "Tell Skalebee what you need in 4 quick steps: Meta Ads, Google Ads, websites, SEO or WhatsApp automation. No call needed to start; we reply within 24 hours.",
    changefreq: "monthly",
    priority: 0.8,
  },
};

export const NOT_FOUND_PAGE = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
  noindex: true,
};

export const formatTitle = (page) =>
  page.absoluteTitle ? page.title : SITE.titleTemplate.replace("%s", page.title);
