// Prerender: after `vite build`, open the built home page in headless Chrome and save the rendered
// page content into dist/index.html. Search engines and link previews then get the real text and
// links straight away instead of an empty <div id="root">. The app still starts normally in the
// browser and simply redraws the same content.
//
// Runs with "prefers-reduced-motion", so the snapshot holds the final (visible) state of every
// animation. If Chrome/Edge is not found, it prints a warning and leaves the build as it is.
//   CHROME_PATH=/path/to/chrome npm run build    (to point it at a specific browser)
import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const DIST = path.resolve("dist");
// Indexable pages (see src/config/seo.js). "/" -> index.html, others -> <route>.html
const ROUTES = ["/", "/contact"];
const fileFor = (route) =>
  route === "/" ? "index.html" : `${route.slice(1)}.html`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const findBrowser = () => {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  return candidates.find((p) => fs.existsSync(p));
};

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

// Tiny static server for dist/ (unknown paths get index.html, like the live site's app routes)
const serve = () =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
      let file = path.join(DIST, url);
      if (
        !file.startsWith(DIST) ||
        !fs.existsSync(file) ||
        fs.statSync(file).isDirectory()
      )
        file = path.join(DIST, "index.html");
      res.writeHead(200, {
        "Content-Type": TYPES[path.extname(file)] || "application/octet-stream",
      });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });

const connect = async (port) => {
  for (let i = 0; i < 60; i++) {
    try {
      const page = (
        await (await fetch(`http://127.0.0.1:${port}/json`)).json()
      ).find((t) => t.type === "page");
      if (page) {
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        if (ws.readyState !== 1)
          await new Promise((r, j) => {
            ws.onopen = r;
            ws.onerror = j;
          });
        let id = 0;
        const pending = new Map();
        ws.onmessage = (e) => {
          const m = JSON.parse(e.data);
          if (m.id && pending.has(m.id)) {
            pending.get(m.id)(m);
            pending.delete(m.id);
          }
        };
        const send = (method, params = {}) =>
          new Promise((r) => {
            const n = ++id;
            pending.set(n, r);
            ws.send(JSON.stringify({ id: n, method, params }));
          });
        return { ws, send };
      }
    } catch {
      /* browser still starting */
    }
    await sleep(250);
  }
  throw new Error("could not connect to the browser");
};

const main = async () => {
  const indexFile = path.join(DIST, "index.html");
  if (!fs.existsSync(indexFile))
    throw new Error("dist/index.html not found - run vite build first");
  const browser = findBrowser();
  if (!browser) {
    console.warn(
      "[prerender] Chrome/Edge not found - skipped (set CHROME_PATH to enable).",
    );
    return;
  }

  const server = await serve();
  const sitePort = server.address().port;
  const debugPort = 9500 + Math.floor(Math.random() * 400);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "prerender-"));
  const proc = spawn(
    browser,
    [
      "--headless=new",
      `--user-data-dir=${profile}`,
      `--remote-debugging-port=${debugPort}`,
      "--hide-scrollbars",
      "--window-size=1440,900",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  try {
    const { ws, send } = await connect(debugPort);
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });

    const template = fs.readFileSync(indexFile, "utf8");
    for (const route of ROUTES) {
      await send("Page.navigate", {
        url: `http://127.0.0.1:${sitePort}${route}`,
      });
      await sleep(4000);
      const res = await send("Runtime.evaluate", {
        expression: `(() => {
          const root = document.getElementById("root");
          // Drop things that only make sense at runtime
          root.querySelectorAll("dialog[open]").forEach((d) => d.removeAttribute("open"));
          const meta = (sel) => document.head.querySelector(sel)?.getAttribute("content") || "";
          return {
            html: root.innerHTML,
            head: {
              title: document.title,
              description: meta('meta[name="description"]'),
              robots: meta('meta[name="robots"]'),
              canonical: document.head.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
              ogTitle: meta('meta[property="og:title"]'),
              ogDescription: meta('meta[property="og:description"]'),
              ogUrl: meta('meta[property="og:url"]'),
            },
          };
        })()`,
        returnByValue: true,
      });
      const { html, head } = res.result?.result?.value || {};
      if (!html || html.length < 1000)
        throw new Error(`nothing rendered for ${route}`);
      // Hidden until the app takes over (avoids a flash + replayed animations); still visible
      // with JavaScript off, and always readable by crawlers.
      const guard =
        "<style>#root[data-prerendered]{visibility:hidden}</style>" +
        "<noscript><style>#root[data-prerendered]{visibility:visible}</style></noscript>";
      const attr = (v) =>
        String(v)
          .replace(/&/g, "&amp;")
          .replace(/"/g, "&quot;")
          .replace(/</g, "&lt;");
      let out = template
        .replace("</head>", `${guard}</head>`)
        .replace(
          '<div id="root"></div>',
          `<div id="root" data-prerendered>${html}</div>`,
        );
      if (!out.includes("data-prerendered>"))
        throw new Error('could not find <div id="root"></div> in index.html');
      // Page-specific head (the template's tags describe the home page)
      if (route !== "/") {
        out = out
          .replace(
            /<title>[^<]*<\/title>/,
            `<title>${attr(head.title)}</title>`,
          )
          .replace(
            /(<meta name="description" content=")[^"]*/,
            `$1${attr(head.description)}`,
          )
          .replace(
            /(<meta name="robots" content=")[^"]*/,
            `$1${attr(head.robots)}`,
          )
          .replace(
            /(<link rel="canonical" href=")[^"]*/,
            `$1${attr(head.canonical)}`,
          )
          .replace(
            /(<meta property="og:title" content=")[^"]*/,
            `$1${attr(head.ogTitle)}`,
          )
          .replace(
            /(<meta property="og:description" content=")[^"]*/,
            `$1${attr(head.ogDescription)}`,
          )
          .replace(
            /(<meta property="og:url" content=")[^"]*/,
            `$1${attr(head.ogUrl)}`,
          )
          .replace(
            /(<meta name="twitter:title" content=")[^"]*/,
            `$1${attr(head.ogTitle)}`,
          )
          .replace(
            /(<meta name="twitter:description" content=")[^"]*/,
            `$1${attr(head.ogDescription)}`,
          );
      }
      fs.writeFileSync(path.join(DIST, fileFor(route)), out);
      console.log(
        `[prerender] ${route} -> dist/${fileFor(route)} (${Math.round(html.length / 1024)} KB of HTML)`,
      );
    }
    ws.close();
  } finally {
    proc.kill();
    server.close();
  }
};

main().catch((err) => {
  // Never break the build: the site works without prerendering, it is just less crawlable.
  console.warn(`[prerender] skipped: ${err.message}`);
});
