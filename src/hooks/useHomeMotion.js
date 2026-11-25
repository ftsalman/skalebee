import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Homepage-specific motion stays separate from the shared reveal primitives.
export default function useHomeMotion(scopeRef) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 1024px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)", () => {
      const track = scopeRef.current.querySelector(".home-work-track");
      if (!track) return;
      const stage = track.querySelector(".home-work-stage");
      const cards = Array.from(stage.children);
      const transitions = cards.length - 1;
      if (transitions < 1) return;

      const peek = 20;
      const scaleAtDepth = (depth) => 0.89 ** depth;
      track.classList.add("is-stacked");
      track.style.setProperty("--deck-inset", `${peek * transitions + 8}px`);
      track.style.height = `calc(${100 + 80 * transitions}svh - var(--pin-top))`;

      cards.forEach((card, depth) => {
        gsap.set(card, { zIndex: cards.length - depth, y: -peek * depth, scale: scaleAtDepth(depth) });
      });
      // CSS holds the deck in place. The measured track supplies exactly the
      // same scroll interval to the scrubbed timeline in both directions.
      const timeline = gsap.timeline({
        defaults: { duration: 1, ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: () => `top ${getComputedStyle(stage).top}`,
          end: () => `+=${track.offsetHeight - stage.offsetHeight}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      for (let front = 0; front < transitions; front++) {
        timeline.to(cards[front], { y: () => stage.clientHeight }, front);
        cards.slice(front + 1).forEach((card, depth) => {
          timeline.to(card, { y: -peek * depth, scale: scaleAtDepth(depth) }, front);
        });
      }

      // Tabbing to a covered project brings its card to the front.
      const revealFocusedCard = (event) => {
        if (!event.target.matches("button:focus-visible")) return;
        const index = cards.indexOf(event.target.closest(".home-project"));
        if (index < 0) return;
        const trigger = timeline.scrollTrigger;
        trigger.scroll(trigger.start + (trigger.end - trigger.start) * index / transitions);
        ScrollTrigger.update();
      };
      stage.addEventListener("focusin", revealFocusedCard);
      return () => {
        stage.removeEventListener("focusin", revealFocusedCard);
        track.classList.remove("is-stacked");
        track.style.removeProperty("--deck-inset");
        track.style.removeProperty("height");
      };
    });
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
