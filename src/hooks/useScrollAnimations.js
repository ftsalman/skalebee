import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Adds scroll animations to every element inside `scopeRef` using data attributes:
 *
 *   data-animate="fade-up"     fade + slide up when scrolled into view
 *   data-animate="fade-in"     fade in
 *   data-animate="scale-in"    fade + scale up
 *   data-animate="stagger"     animate the direct children one after another
 *   data-delay="0.2"           optional delay (seconds)
 *   data-start="top bottom"    optional: when to start (default "top 85%")
 *   data-parallax="0.3"        parallax: moves at a different speed while scrolling
 *                              (positive = slower / moves down, negative = faster / up)
 *   data-counter="250"         counts up from 0 (use data-decimals="1" for decimals)
 *
 * Animations are skipped for users who prefer reduced motion.
 */
export default function useScrollAnimations(scopeRef) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(scopeRef);
        // data-start="top bottom" makes an element animate as soon as it is on screen (e.g. hero)
        const trigger = (el, start = "top 85%") => ({
          trigger: el,
          start: el.dataset.start || start,
          toggleActions: "play none none none",
        });
        const delayOf = (el) => parseFloat(el.dataset.delay || 0);

        q('[data-animate="fade-up"]').forEach((el) =>
          gsap.from(el, {
            y: 60,
            autoAlpha: 0,
            duration: 1,
            ease: "power3.out",
            delay: delayOf(el),
            scrollTrigger: trigger(el),
          }),
        );

        q('[data-animate="fade-in"]').forEach((el) =>
          gsap.from(el, {
            autoAlpha: 0,
            duration: 1.2,
            ease: "power2.out",
            delay: delayOf(el),
            scrollTrigger: trigger(el),
          }),
        );

        q('[data-animate="scale-in"]').forEach((el) =>
          gsap.from(el, {
            scale: 0.85,
            autoAlpha: 0,
            duration: 1.1,
            ease: "power3.out",
            delay: delayOf(el),
            scrollTrigger: trigger(el),
          }),
        );

        q('[data-animate="stagger"]').forEach((el) =>
          gsap.from(el.children, {
            y: 50,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            delay: delayOf(el),
            scrollTrigger: trigger(el),
          }),
        );

        q("[data-parallax]").forEach((el) => {
          const parsedSpeed = parseFloat(el.dataset.parallax);
          const speed = Number.isFinite(parsedSpeed) ? parsedSpeed : 0.2;
          gsap.fromTo(
            el,
            { y: () => -speed * 100 },
            {
              y: () => speed * 100,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      // Counters run even with reduced motion (they just jump to the value)
      mm.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
        gsap.utils.selector(scopeRef)("[data-counter]").forEach((el) => {
        const end = parseFloat(el.dataset.counter);
        const decimals = parseInt(el.dataset.decimals || 0, 10);
        if (context.conditions.reduce) {
          el.textContent = end.toFixed(decimals);
          return;
        }
        const obj = { val: 0 };
        const render = () => {
          el.textContent = obj.val.toFixed(decimals);
        };
        render();
        gsap.to(obj, {
          val: end,
          duration: 2,
          ease: "power2.out",
          onUpdate: render,
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
        });
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );
}
