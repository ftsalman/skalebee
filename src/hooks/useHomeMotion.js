import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Homepage-specific motion stays separate from the shared reveal primitives.
export default function useHomeMotion(scopeRef) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(scopeRef);
      q("[data-home-parallax]").forEach((image) => {
        gsap.fromTo(image, { yPercent: -5 }, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: image.closest("[data-home-parallax-frame]"), start: "top bottom", end: "bottom top", scrub: 0.5, invalidateOnRefresh: true },
        });
      });
      q("[data-home-step]").forEach((step) => {
        gsap.from(step, { opacity: 0.3, y: 35, ease: "none", scrollTrigger: { trigger: step, start: "top 88%", end: "top 55%", scrub: 0.4 } });
      });
    });
    // Font metrics can move individual triggers even if the page height stays the same.
    let active = true;
    const refresh = () => { if (active) ScrollTrigger.refresh(); };
    document.fonts.ready.then(refresh);
    // Refreshing re-measures every trigger, which is expensive and can make the page jump
    // mid-scroll. Only do it once the content height has really changed and settled.
    // (Window resizes are already handled by ScrollTrigger itself.)
    let resizeTimer;
    let lastHeight = scopeRef.current.offsetHeight;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const height = scopeRef.current?.offsetHeight ?? lastHeight;
        if (Math.abs(height - lastHeight) < 2) return;
        refresh();
        // Pins add spacing during refresh; measure after so it does not trigger another refresh.
        lastHeight = scopeRef.current?.offsetHeight ?? height;
      }, 250);
    });
    observer.observe(scopeRef.current);
    return () => {
      active = false;
      observer.disconnect();
      clearTimeout(resizeTimer);
      media.revert();
    };
  }, { scope: scopeRef });
}
