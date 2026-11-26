import { Children, cloneElement, isValidElement, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Keep JSX emphasis, links, whitespace and line breaks in the reading order.
function splitWords(children, highlight, highlightClassName) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return String(child).split(/(\s+)/).map((word, index) =>
        !word.trim() ? word : (
          <span key={index} data-reveal-word=""
            className={highlight.includes(word.replace(/[.,!?]/g, "")) ? highlightClassName : undefined}>
            {word}
          </span>
        ),
      );
    }
    if (!isValidElement(child) || !child.props.children) return child;
    // Keep an annotated phrase and its pen stroke together.
    if (child.props["data-ink"]) return cloneElement(child, { "data-reveal-word": "" });
    return cloneElement(child, {}, splitWords(child.props.children, highlight, highlightClassName));
  });
}

export function AnimatedText({
  as: Tag = "h2", text, children, highlight = [], highlightClassName = "text-bee-yellow",
  scrub = false, delay = 0, ...props
}) {
  const root = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const element = root.current;
      const words = element.querySelectorAll("[data-reveal-word]");
      if (!words.length) return;

      const reveal = gsap.fromTo(words, { opacity: 0.045, filter: "blur(4px)" }, {
        opacity: 1, filter: "blur(0px)", duration: 0.55, ease: "power1.out",
        stagger: scrub ? 0.18 : { amount: Math.min(0.44, words.length * 0.035) },
        paused: !scrub, delay: scrub ? 0 : delay,
        ...(scrub ? {
          scrollTrigger: {
            trigger: element, start: "top 82%", end: "bottom 70%", scrub: 0.15,
            invalidateOnRefresh: true,
          },
        } : { clearProps: "filter,opacity" }),
      });
      if (scrub) return;

      // Intersection also follows pinned panels, open dialogs and newly mounted cards.
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal.play();
          observer.disconnect();
        }
      });
      observer.observe(element);
      return () => observer.disconnect();
    });
    return () => media.revert();
  }, { scope: root, dependencies: [text, scrub, delay, typeof children === "string" ? children : null], revertOnUpdate: true });

  return <Tag ref={root} {...props}>{splitWords(text ?? children, highlight, highlightClassName)}</Tag>;
}
