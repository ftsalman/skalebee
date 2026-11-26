// Vite plugin: static SEO for a client-rendered site.
// - Injects title, description, canonical, Open Graph, Twitter and JSON-LD into index.html
//   (so crawlers and social previews see them without running JavaScript)
// - Adds a <noscript> summary of the page content
// - Emits sitemap.xml, robots.txt, .htaccess (real 404s, compression, caching) and 404.html
// Everything is driven by src/config/seo.js and the home page data.
// (scripts/prerender.mjs then fills index.html with the rendered page content.)
import fs from "node:fs";
import path from "node:path";
import { NOT_FOUND_PAGE, PAGES, SITE, formatTitle, getSiteUrl } from "./src/config/seo.js";
import { FAQS, HERO, SERVICES } from "./src/features/home/constants/homeData.js";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// JSON inside <script> must not contain "</script>"
const jsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

const absolute = (siteUrl, path) => (/^https?:\/\//.test(path) ? path : `${siteUrl}${path}`);

const structuredData = (siteUrl) => {
  const b = SITE.business;
  const orgId = `${siteUrl}/#organization`;
  const address =
    b.city || b.region || b.country
      ? {
          "@type": "PostalAddress",
          ...(b.street && { streetAddress: b.street }),
          ...(b.city && { addressLocality: b.city }),
          ...(b.region && { addressRegion: b.region }),
          ...(b.postalCode && { postalCode: b.postalCode }),
          ...(b.country && { addressCountry: b.country }),
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": b.type,
        "@id": orgId,
        name: SITE.name,
        ...(b.legalName && { legalName: b.legalName }),
        url: `${siteUrl}/`,
        logo: absolute(siteUrl, SITE.logo),
        image: absolute(siteUrl, SITE.ogImage),
        description: SITE.description,
        ...(b.email && { email: b.email }),
        ...(b.telephone && { telephone: b.telephone }),
        ...(address && { address }),
        ...(b.foundingYear && { foundingDate: b.foundingYear }),
        areaServed: b.areaServed.map((place) => ({ "@type": place.type, name: place.name })),
        ...(b.sameAs.length && { sameAs: b.sameAs }),
        knowsAbout: SITE.keywords,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Digital marketing services",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.description },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: SITE.name,
        inLanguage: "en",
        publisher: { "@id": orgId },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };
};

const headTags = (siteUrl) => {
  const home = PAGES["/"];
  const title = formatTitle(home);
  const image = absolute(siteUrl, SITE.ogImage);
  const meta = (attrs) => ({ tag: "meta", attrs, injectTo: "head" });

  return [
    { tag: "title", children: esc(title), injectTo: "head" },
    meta({ name: "description", content: home.description }),
    meta({ name: "keywords", content: SITE.keywords.join(", ") }),
    meta({ name: "robots", content: "index, follow, max-image-preview:large" }),
    meta({ name: "theme-color", content: SITE.themeColor }),
    { tag: "link", attrs: { rel: "canonical", href: `${siteUrl}/` }, injectTo: "head" },
    meta({ property: "og:type", content: "website" }),
    meta({ property: "og:site_name", content: SITE.name }),
    meta({ property: "og:locale", content: SITE.locale }),
    meta({ property: "og:title", content: title }),
    meta({ property: "og:description", content: home.description }),
    meta({ property: "og:url", content: `${siteUrl}/` }),
    meta({ property: "og:image", content: image }),
    ...(SITE.ogImageWidth ? [meta({ property: "og:image:width", content: String(SITE.ogImageWidth) }), meta({ property: "og:image:height", content: String(SITE.ogImageHeight) })] : []),
    meta({ property: "og:image:alt", content: SITE.ogImageAlt }),
    meta({ name: "twitter:card", content: "summary_large_image" }),
    ...(SITE.twitterHandle ? [meta({ name: "twitter:site", content: SITE.twitterHandle })] : []),
    meta({ name: "twitter:title", content: title }),
    meta({ name: "twitter:description", content: home.description }),
    meta({ name: "twitter:image", content: image }),
    {
      tag: "script",
      attrs: { type: "application/ld+json" },
      children: jsonLd(structuredData(siteUrl)),
      injectTo: "head",
    },
  ];
};

// Plain-HTML version of the key content for crawlers that don't run JavaScript.
const noscript = () => {
  const headline = HERO.titleLines
    .map((line) => line.filter((w) => !w.startsWith("{")).join(" "))
    .join(" ");
  const services = SERVICES.map((s) => `<li><strong>${esc(s.title)}</strong>: ${esc(s.description)}</li>`).join("");
  const links = Object.keys(PAGES)
    .map((p) => `<a href="${p}">${esc(PAGES[p].absoluteTitle ? "Home" : PAGES[p].title)}</a>`)
    .join(" · ");
  return `<noscript><main><h1>${esc(headline)}</h1><p>${esc(SITE.description)}</p><h2>Our services</h2><ul>${services}</ul><nav>${links}</nav></main></noscript>`;
};

const sitemap = (siteUrl) => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = Object.entries(PAGES)
    .filter(([, page]) => !page.noindex)
    .map(
      ([path, page]) =>
        `  <url>\n    <loc>${siteUrl}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

const robots = (siteUrl, allow) =>
  allow
    ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
    : // Non-production builds (e.g. beta) are kept out of search engines.
      `User-agent: *\nDisallow: /\n`;

// Apache config: real files are served as-is, known routes go to the app, and every other URL
// returns a genuine 404 (instead of a "soft 404": the app shell with status 200).
const htaccess = () => {
  const routes = Object.keys(PAGES)
    .filter((p) => p !== "/")
    .map((p) => p.replace(/^\//, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return `# Generated by seo.plugin.js at build time - edit the routes in src/config/seo.js
DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  # Existing files and folders (assets, images, sitemap.xml...) are served directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  # App routes: the prerendered page if there is one (e.g. contact.html), else the app shell
  RewriteCond %{DOCUMENT_ROOT}/$1.html -f
  RewriteRule ^(${routes.join("|")})/?$ /$1.html [L]
  RewriteRule ^(${routes.join("|")})/?$ /index.html [L]
  # Anything else: no rule matches, so Apache answers 404 with /404.html
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml text/xml application/xml text/plain
</IfModule>

# Caching: hashed build files never change; HTML is always re-checked
<IfModule mod_headers.c>
  <FilesMatch "^assets/">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.(jpe?g|png|webp|avif|svg|woff2)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`;
};

export default function seoPlugin(env, mode) {
  const siteUrl = getSiteUrl(env);
  const isProduction = mode === "production";
  let outDir = "dist";
  return {
    name: "skalebee-seo",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return {
          html: html.replace("<body>", `<body>\n    ${noscript()}`),
          tags: headTags(siteUrl),
        };
      },
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap(siteUrl) });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots(siteUrl, isProduction) });
      this.emitFile({ type: "asset", fileName: ".htaccess", source: htaccess() });
    },
    // 404 page: the app shell, marked noindex, served with a real 404 status by .htaccess.
    // (The app itself shows the "Page not found" screen for unknown URLs.)
    writeBundle() {
      const indexFile = path.join(outDir, "index.html");
      if (!fs.existsSync(indexFile)) return;
      const html = fs
        .readFileSync(indexFile, "utf8")
        .replace(/<title>[^<]*<\/title>/, `<title>${esc(formatTitle(NOT_FOUND_PAGE))}</title>`)
        .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow">')
        .replace(/<link rel="canonical"[^>]*>/, "")
        .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
      fs.writeFileSync(path.join(outDir, "404.html"), html);
    },
  };
}
