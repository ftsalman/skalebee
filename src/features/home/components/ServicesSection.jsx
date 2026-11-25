import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SERVICES, SERVICES_SECTION } from "../constants/homeData";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COUNT = SERVICES.length;
const LAST = COUNT - 1;
const MOTION = "(prefers-reduced-motion: reduce)";
const TICKS = Array.from({ length: 12 }, (_, i) => i);

// Track both ends of the pill independently as the selected tab expands.
// The nearby ruler marks rise and settle as the pill passes them.
function ServiceRuler({ active, select }) {
  const wrapRef = useRef(null);
  const railRef = useRef(null);
  const pillRef = useRef(null);
  const edges = useRef(null);

  useLayoutEffect(() => {
    const rail = railRef.current;
    const wrap = wrapRef.current;
    const pill = pillRef.current;
    const tab = rail.querySelector('[aria-selected="true"]');
    const ticks = Array.from(rail.querySelectorAll(".svc-ticks i"));
    const motion = window.matchMedia(MOTION);
    let frame;
    let lastTime;
    let started;

    const paint = (now) => {
      const step = Math.min(50, now - (lastTime ?? now - 16)) / 1000;
      lastTime = now;
      started ??= now;
      const origin = rail.getBoundingClientRect().left;
      const rect = tab.getBoundingClientRect();
      const left = rect.left - origin;
      const right = rect.right - origin;
      if (!edges.current || motion.matches) edges.current = [left, right];
      const [prevL, prevR] = edges.current;
      const l = left + (prevL - left) * Math.exp(-step * (left < prevL ? 24 : 14));
      const r = right + (prevR - right) * Math.exp(-step * (right > prevR ? 24 : 14));
      edges.current = [l, r];
      // Read the tick positions before writing any styles.
      const positions = ticks.map((tick) => tick.getBoundingClientRect().left - origin);
      pill.style.transform = `translateX(${l}px)`;
      pill.style.width = `${r - l}px`;
      ticks.forEach((tick, i) => {
        const x = positions[i];
        const distance = Math.max(l - x, x - r, 0);
        // Ticks next to the pill grow a little and darken, fading out over ~30px.
        const near = Math.exp(-distance / 26);
        tick.style.transform = `scaleY(${1 + 0.7 * near})`;
        tick.style.setProperty("--near", near.toFixed(3));
        tick.classList.toggle("is-passed", x < l);
      });
      if (wrap.scrollWidth > wrap.clientWidth) {
        wrap.scrollLeft = (l + r - wrap.clientWidth) / 2;
      }
      if (!motion.matches && (now - started < 480 || Math.abs(left - l) + Math.abs(right - r) > 0.3)) {
        frame = requestAnimationFrame(paint);
      }
    };

    const refresh = () => {
      cancelAnimationFrame(frame);
      started = undefined;
      lastTime = undefined;
      paint(performance.now());
    };
    refresh();
    const resize = new ResizeObserver(refresh);
    resize.observe(wrap);
    resize.observe(tab);
    motion.addEventListener("change", refresh);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      motion.removeEventListener("change", refresh);
    };
  }, [active]);

  const onKeyDown = (event, i) => {
    const next = { ArrowLeft: (i + LAST) % COUNT, ArrowRight: (i + 1) % COUNT, Home: 0, End: LAST }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    railRef.current.querySelectorAll('[role="tab"]')[next].focus({ preventScroll: true });
    select(next);
  };

  return (
    <div className="svc-stepper-wrap" ref={wrapRef} data-lenis-prevent-horizontal>
      <div className="svc-stepper" role="tablist" aria-label="Services" ref={railRef}>
        <span className="svc-indicator" ref={pillRef} aria-hidden="true" />
        {SERVICES.map((service, i) => (
          <div className="svc-stepper-group" role="presentation" key={service.title}>
            <button type="button" role="tab" id={`svc-tab-${i}`} aria-controls="svc-panel"
              aria-label={service.title} aria-selected={active === i} tabIndex={active === i ? 0 : -1}
              className={`svc-step${i < active ? " is-done" : ""}`}
              onClick={() => select(i)} onKeyDown={(event) => onKeyDown(event, i)}>
              <span className="svc-step-num">{i + 1}</span>
              <span className="svc-step-label"><span>{service.title}</span></span>
            </button>
            {i < LAST && <span className="svc-ticks" aria-hidden="true">{TICKS.map(k => <i key={k} />)}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceArtwork({ artwork }) {
  const videoRef = useRef(null);
  const base = `/imgs/home/services/${artwork}`;

  useEffect(() => {
    const video = videoRef.current;
    const motion = window.matchMedia(MOTION);
    let visible = false;
    let attempt = 0;
    const update = () => {
      const token = ++attempt;
      video.hidden = true;
      if (!visible || motion.matches) {
        video.pause();
        return;
      }
      video.currentTime = 0;
      video.play().then(() => {
        if (token === attempt) video.hidden = false;
      }).catch(() => { /* The completed illustration is available underneath. */ });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.15 });
    observer.observe(video.parentElement);
    motion.addEventListener("change", update);
    return () => {
      ++attempt;
      observer.disconnect();
      motion.removeEventListener("change", update);
      video.pause();
    };
  }, []);

  return (
    <>
      <img className="svc-poster" src={`${base}.webp`} alt="" decoding="async" />
      <video className="svc-film" ref={videoRef} src={`${base}.webm`} muted playsInline preload="none" hidden
        aria-hidden="true" onError={(event) => { event.currentTarget.hidden = true; }} />
    </>
  );
}

export const ServicesSection = () => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)", () => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 0.5 * COUNT}`,
        pin: sectionRef.current.querySelector(".svc"),
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => setActive(Math.min(LAST, Math.floor(progress * COUNT))),
      });
      triggerRef.current = trigger;
      return () => { triggerRef.current = null; };
    });
    return () => media.revert();
  }, { scope: sectionRef });

  // Keep the outgoing artwork in place for the short exit. Fast selections only
  // start the film for the most recent destination.
  useEffect(() => {
    if (active === shown) return;
    const timer = window.setTimeout(() => setShown(active), window.matchMedia(MOTION).matches ? 0 : 160);
    return () => clearTimeout(timer);
  }, [active, shown]);

  const select = (index) => {
    setActive(index);
    const trigger = triggerRef.current;
    if (!trigger) return;
    const top = trigger.start + (trigger.end - trigger.start) * (index + 0.25) / COUNT;
    if (window.__lenis) window.__lenis.scrollTo(top, { immediate: true });
    else window.scrollTo({ top, behavior: "instant" });
    ScrollTrigger.update();
  };

  const service = SERVICES[active];
  return (
    <section id="services" ref={sectionRef} aria-labelledby="services-heading">
      <div className="svc">
        <div className="svc-inner">
          <h2 id="services-heading" className="svc-title">{COUNT} services <span>{SERVICES_SECTION.muted}</span></h2>
          <ServiceRuler active={active} select={select} />
          <div className="svc-card-wrap" id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${active}`} tabIndex={0}>
            <div className="svc-left" key={service.title}>
              <span className="svc-badge" aria-hidden="true">{active + 1}</span>
              <div className="svc-copy">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
            <div className={`svc-right${active !== shown ? " is-leaving" : ""}`}>
              <ServiceArtwork key={shown} artwork={SERVICES[shown].artwork} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
