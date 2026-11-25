import { useEffect } from "react";
import { NOT_FOUND_PAGE, PAGES, formatTitle, getSiteUrl } from "@/config/seo";

const SITE_URL = getSiteUrl(import.meta.env);

// Update an existing <meta>/<link> from index.html, or create it if it is missing.
const setTag = (selector, create, attr, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const setMeta = (key, value, attr = "name") =>
  setTag(
    `meta[${attr}="${key}"]`,
    () => {
      const m = document.createElement("meta");
      m.setAttribute(attr, key);
      return m;
    },
    "content",
    value,
  );

/**
 * Keeps <title>, description, canonical, robots and social tags in sync with the route.
 * Page details live in src/config/seo.js.
 */
export default function usePageSeo(pathname) {
  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    const page = PAGES[path] ?? NOT_FOUND_PAGE;
    const title = formatTitle(page);
    const url = `${SITE_URL}${path === "/" ? "/" : path}`;

    document.title = title;
    setMeta("description", page.description);
    setMeta("robots", page.noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
    setMeta("og:title", title, "property");
    setMeta("og:description", page.description, "property");
    setMeta("og:url", url, "property");
    setMeta("twitter:title", title);
    setMeta("twitter:description", page.description);
    setTag(
      'link[rel="canonical"]',
      () => {
        const l = document.createElement("link");
        l.rel = "canonical";
        return l;
      },
      "href",
      url,
    );
  }, [pathname]);
}
