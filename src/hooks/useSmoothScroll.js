import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// One scroll owner for the app; route and hash links share the same behavior.
export default function useSmoothScroll() {
  const lenisRef = useRef(null);
  const lastPathname = useRef(null);
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let tick;
    const destroy = () => {
      if (tick) gsap.ticker.remove(tick);
      lenisRef.current?.destroy();
      if (window.__lenis === lenisRef.current) delete window.__lenis;
      lenisRef.current = null;
    };
    const setup = () => {
      destroy();
      if (media.matches) return;
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false });
      lenisRef.current = lenis;
      window.__lenis = lenis; // lets sections scroll smoothly to a position (e.g. services stepper)
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };
    setup();
    media.addEventListener("change", setup);
    return () => { media.removeEventListener("change", setup); destroy(); };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (lastPathname.current !== pathname) {
        ScrollTrigger.refresh();
        lenisRef.current?.resize();
        lastPathname.current = pathname;
      }
      let target = null;
      try { target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null; } catch { /* Invalid URL hashes fall back to the page top. */ }
      if (target) {
        if (lenisRef.current) lenisRef.current.scrollTo(target);
        else target.scrollIntoView({ behavior: "instant", block: "start" });
      } else if (!hash) {
        if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
        else window.scrollTo({ top: 0, behavior: "instant" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);
}
