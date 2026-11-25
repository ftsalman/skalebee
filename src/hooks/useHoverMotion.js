import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * Hover effects, run by GSAP instead of CSS transitions.
 *
 * Mark the element that reacts to the pointer with `data-hover`, and the elements that
 * move with `hoverTo({...})` (GSAP vars). They can be the same element, or children:
 *
 *   <a data-hover {...hoverTo({ y: -2 })}>Lift me</a>
 *   <article data-hover>
 *     <img {...hoverTo({ scale: 1.04, duration: 0.9 })} />
 *     <span {...hoverTo({ autoAlpha: 1, y: 0 })} />
 *   </article>
 *
 * Keyboard focus (:focus-visible) plays the same effect. A child belongs to its closest
 * `data-hover` ancestor. On leave the tween reverses, then its inline styles are cleared,
 * so the element's own Tailwind classes apply again. Touch taps are ignored, and with
 * reduced motion the change is instant.
 *
 * useHoverMotion() is installed once, in the main layout.
 */
export const hoverTo = (vars) => ({ "data-hover-to": JSON.stringify(vars) });

const DEFAULTS = { duration: 0.35, ease: "power2.out" };
const NOT_STYLE = new Set(["duration", "ease", "delay", "stagger", "overwrite"]);
const TRANSFORM = new Set(["x", "y", "xPercent", "yPercent", "scale", "scaleX", "scaleY", "rotate", "rotation", "skewX", "skewY"]);
const timelines = new WeakMap();
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const partsOf = (trigger) => {
  const parts = [...trigger.querySelectorAll("[data-hover-to]")].filter(
    (el) => el.closest("[data-hover]") === trigger,
  );
  if (trigger.hasAttribute("data-hover-to")) parts.unshift(trigger);
  return parts;
};

// Inline styles the tween wrote, so they can be removed after it reverses.
const propsToClear = (vars) => {
  const keys = Object.keys(vars).filter((k) => !NOT_STYLE.has(k));
  const props = keys.filter((k) => !TRANSFORM.has(k)).map((k) => (k === "autoAlpha" ? "opacity,visibility" : k));
  if (keys.some((k) => TRANSFORM.has(k))) props.push("transform");
  return props.join(",");
};

const build = (trigger) => {
  const instant = reduceMotion();
  const parts = partsOf(trigger).map((el) => ({ el, vars: JSON.parse(el.dataset.hoverTo) }));
  const tl = gsap.timeline({
    paused: true,
    defaults: DEFAULTS,
    onReverseComplete: () => {
      parts.forEach(({ el, vars }) => gsap.set(el, { clearProps: propsToClear(vars) }));
      timelines.delete(trigger);
    },
  });
  parts.forEach(({ el, vars }) => tl.to(el, instant ? { ...vars, duration: 0, delay: 0 } : vars, 0));
  return tl;
};

const enter = (trigger) => {
  let tl = timelines.get(trigger);
  if (!tl) {
    // Built on each fresh hover, so it starts from the element's current classes.
    tl = build(trigger);
    timelines.set(trigger, tl);
  }
  tl.play();
};

const leave = (trigger) => timelines.get(trigger)?.reverse();

// Every data-hover ancestor of `node`, innermost first.
const triggersOf = (node) => {
  const list = [];
  for (let el = node?.closest?.("[data-hover]"); el; el = el.parentElement?.closest("[data-hover]")) list.push(el);
  return list;
};

export default function useHoverMotion() {
  useEffect(() => {
    const over = (event) => {
      if (event.pointerType === "touch") return;
      triggersOf(event.target).forEach((t) => !t.contains(event.relatedTarget) && enter(t));
    };
    const out = (event) => {
      if (event.pointerType === "touch") return;
      triggersOf(event.target).forEach((t) => !t.contains(event.relatedTarget) && leave(t));
    };
    const focusIn = (event) => {
      if (!event.target.matches?.(":focus-visible")) return;
      triggersOf(event.target).forEach(enter);
    };
    const focusOut = (event) => {
      triggersOf(event.target).forEach((t) => {
        if (!t.contains(event.relatedTarget) && !t.matches(":hover")) leave(t);
      });
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    document.addEventListener("focusin", focusIn);
    document.addEventListener("focusout", focusOut);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("focusin", focusIn);
      document.removeEventListener("focusout", focusOut);
    };
  }, []);
}
