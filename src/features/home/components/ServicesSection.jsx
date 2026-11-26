import { AnimatedText } from "@/components/common/AnimatedText";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@turtle-ui/utils";
import { hoverTo } from "@/hooks/useHoverMotion";
import { SERVICES, SERVICES_SECTION } from "../constants/homeData";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COUNT = SERVICES.length;
const LAST = COUNT - 1;
const MOTION = "(prefers-reduced-motion: reduce)";
const TICKS = Array.from({ length: 12 }, (_, i) => i);
const reduced = () => window.matchMedia(MOTION).matches;

// Edge positions sampled every 100 ms from the reference. The front arrives
// around 600 ms, while the back of the capsule takes another second to settle.
const front = gsap.utils.interpolate([0, .20, .62, .86, .96, .99, 1]);
const back = gsap.utils.interpolate([0, .01, .12, .38, .62, .78, .86, .91, .94, .96, .975, .985, .992, .996, .998, 1]);

function ServiceRuler({ active, select }) {
  const wrapRef = useRef(null);
  const railRef = useRef(null);
  const pillRef = useRef(null);
  const neckRef = useRef(null);
  const bridgeRef = useRef(null);
  const captionRef = useRef(null);
  const lastFrame = useRef(null);

  useLayoutEffect(() => {
    const rail = railRef.current;
    const wrap = wrapRef.current;
    const pill = pillRef.current;
    const neck = neckRef.current;
    const caption = captionRef.current;
    const tabs = Array.from(rail.querySelectorAll('[role="tab"]'));
    const motion = window.matchMedia(MOTION);
    let frame;

    function start(animate) {
      cancelAnimationFrame(frame);
      const origin = rail.getBoundingClientRect().left;
      const rect = tabs[active].getBoundingClientRect();
      const left = rect.left - origin;
      const right = rect.right - origin;
      const ticks = Array.from(rail.querySelectorAll("[data-svc-ticks] i"), (el) => ({
        el, x: el.getBoundingClientRect().left - origin,
      }));
      const from = lastFrame.current;
      const travel = animate && from && from.index !== active && !motion.matches;
      const forward = !from || left >= from.left;
      const station = tabs[from?.index ?? active].getBoundingClientRect().left - origin + 22;
      const started = performance.now();
      const changeLabel = !from || from.label !== active;
      const viewportWidth = wrap.clientWidth;
      const scrollable = wrap.scrollWidth > viewportWidth;
      const svgGroup = pill.parentNode;
      let captionWidth = caption.offsetWidth;
      svgGroup.setAttribute("filter", travel ? "url(#svc-liquid)" : "none");
      neck.setAttribute("cx", station);

      function paint(now) {
        const elapsed = travel ? Math.max(0, (now - started) / 1000) : 1.5;
        const lead = front(Math.min(1, elapsed / .6));
        const trail = back(Math.min(1, elapsed / 1.5));
        const l = travel ? gsap.utils.interpolate(from.left, left, forward ? trail : lead) : left;
        const r = travel ? gsap.utils.interpolate(from.right, right, forward ? lead : trail) : right;
        const x = travel ? gsap.utils.interpolate(from.x, left, lead) : left;
        const label = travel && elapsed < .30 ? from.label : active;
        const fade = changeLabel && travel
          ? gsap.utils.clamp(0, 1, elapsed < .30 ? (0.30 - elapsed) / .18 : (elapsed - .30) / .14)
          : 1;
        pill.setAttribute("x", l);
        pill.setAttribute("width", r - l);
        neck.setAttribute("r", travel && elapsed < .37 ? 15 : 0);
        // The old dot stays attached by a thinning strand until the pill pulls free.
        const side = station < l ? 1 : -1;
        const edge = side === 1 ? l : r;
        const gap = (edge - station) * side;
        if (travel && elapsed < .32 && gap > 0 && gap < 110) {
          const mid = (station + edge) / 2;
          const tip = edge + side * 14;
          const half = 5 * (1 - elapsed / .32);
          bridgeRef.current.setAttribute("d",
            `M ${station} 19 Q ${mid} ${31 - half} ${tip} 14 L ${tip} 48 Q ${mid} ${31 + half} ${station} 43 Z`);
        } else {
          bridgeRef.current.removeAttribute("d");
        }
        if (elapsed >= .42) svgGroup.removeAttribute("filter");

        const [number, title] = caption.children;
        if (caption.dataset.index !== String(label)) {
          number.textContent = String(label + 1);
          title.textContent = SERVICES[label].title;
          caption.dataset.index = String(label);
          captionWidth = caption.offsetWidth;
        }
        caption.style.transform = `translateX(${x}px)`;
        caption.style.opacity = fade;
        caption.style.filter = fade < 1 ? `blur(${(1 - fade) * 4}px)` : "";
        // Keep the moving type inside the independently stretching edges.
        caption.style.clipPath = `inset(0 ${Math.max(0, x + captionWidth - r)}px 0 ${Math.max(0, l - x)}px)`;
        for (const { el, x: tickX } of ticks) {
          const distance = Math.max(l - tickX, tickX - r, 0);
          const near = Math.exp(-distance / 54);
          el.style.transform = `scaleY(${1 + 1.55 * near})`;
          el.style.backgroundColor = tickX < l ? "#43445c" : "#dcdee5";
        }
        if (scrollable) wrap.scrollTo({ left: (l + r - viewportWidth) / 2, behavior: "instant" });
        lastFrame.current = { left: l, right: r, x, label, index: active };
        if (elapsed < 1.5) frame = requestAnimationFrame(paint);
      }
      paint(started);
    }

    start(true);
    const refresh = () => start(false);
    const observer = new ResizeObserver((entries) => {
      // The observer's initial delivery must not interrupt a new selection.
      if (entries.some(({ target }) => target.clientWidth !== widths.get(target))) {
        for (const { target } of entries) widths.set(target, target.clientWidth);
        refresh();
      }
    });
    const widths = new Map([wrap, ...tabs].map((el) => [el, el.clientWidth]));
    widths.forEach((_, el) => observer.observe(el));
    motion.addEventListener("change", refresh);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
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
    <div
      className="mx-auto mt-[clamp(26px,6.2svh,62px)] w-[min(100%,1098px)] overflow-x-auto rounded-full bg-[#f8f8fa] [overflow-anchor:none] [scrollbar-width:none] max-lg:mt-[34px] [&::-webkit-scrollbar]:hidden"
      ref={wrapRef}
      data-lenis-prevent-horizontal
    >
      <div className="relative isolate flex w-full min-w-[max(100%,720px)] items-center p-2" role="tablist" aria-label="Services" ref={railRef}>
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] size-full overflow-visible">
          <defs>
            <filter id="svc-liquid" x="-10%" y="-100%" width="120%" height="300%" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="5" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10.5" />
            </filter>
          </defs>
          <g fill="#17171b">
            <path ref={bridgeRef} />
            <circle ref={neckRef} cy="31" r="0" />
            <rect ref={pillRef} y="8" height="46" rx="23" />
          </g>
        </svg>
        <span
          aria-hidden="true"
          ref={captionRef}
          className="pointer-events-none absolute top-2 left-0 z-[3] flex h-[46px] items-center gap-2 whitespace-nowrap pr-4 pl-[7px] text-white"
        >
          <span className="grid size-[30px] place-items-center rounded-full bg-[#2a2a30] font-home-mono text-sm font-medium" />
          <span className="text-[18px] font-semibold leading-none tracking-[-0.025em] max-tablet:text-base" />
        </span>
        {SERVICES.map((service, i) => {
          const selected = active === i;
          const done = i < active;
          return (
            <div className="relative flex min-w-max items-center not-last:flex-[1_0_0px] not-last:pr-1" role="presentation" key={service.title}>
              <button
                type="button"
                role="tab"
                id={`svc-tab-${i}`}
                aria-controls="svc-panel"
                aria-label={service.title}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                className="relative z-[1] flex h-[46px] flex-none items-center rounded-full border-0 bg-transparent px-[7px] text-svc-ink"
                onClick={() => select(i)}
                onKeyDown={(event) => onKeyDown(event, i)}
                data-hover=""
              >
                <span
                  className={cn(
                    "grid size-[30px] flex-none place-items-center rounded-full border border-[#ced0dd] bg-white font-home-mono text-sm font-medium leading-none text-[#73758e]",
                    (done || selected) && "border-transparent bg-[#17171b] text-white",
                    selected && "bg-[#34343b]",
                  )}
                  {...hoverTo({ borderColor: "#85859b", duration: 0.2 })}
                >
                  {i + 1}
                </span>
                {selected && (
                  <span aria-hidden="true" className="invisible pl-2 pr-[9px] whitespace-nowrap text-[18px] font-semibold leading-none tracking-[-0.025em] max-tablet:text-base">
                    {service.title}
                  </span>
                )}
              </button>
              {i < LAST && (
                <span
                  data-svc-ticks
                  className="pointer-events-none absolute inset-y-0 right-0 left-[50px] flex items-center gap-[14px] overflow-hidden"
                  aria-hidden="true"
                >
                  {TICKS.map((k) => (
                    <i
                      key={k}
                      className="h-[18px] w-px shrink-0 bg-[#dcdee5]"
                    />
                  ))}
                </span>
              )}
            </div>
          );
        })}
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

  const media = "absolute inset-0 size-full object-contain [clip-path:inset(0%_0%_0%_0%)]";
  return (
    <>
      <img className={media} data-svc-art src={`${base}.webp`} alt="" decoding="async" />
      <video
        className={media}
        data-svc-art
        ref={videoRef}
        src={`${base}.webm`}
        muted
        playsInline
        preload="none"
        hidden
        aria-hidden="true"
        onError={(event) => { event.currentTarget.hidden = true; }}
      />
    </>
  );
}

export const ServicesSection = () => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const cardRef = useRef(null);
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)", () => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 0.5 * COUNT}`,
        pin: sectionRef.current.querySelector("[data-svc-pin]"),
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => setActive(Math.min(LAST, Math.floor(progress * COUNT))),
      });
      triggerRef.current = trigger;
      return () => { triggerRef.current = null; };
    });
    return () => media.revert();
  }, { scope: sectionRef });

  // New service: its number, title and text fade up (the text a beat later).
  useGSAP(() => {
    if (reduced()) return;
    const q = gsap.utils.selector(cardRef);
    gsap.from(q("[data-svc-enter]"), { autoAlpha: 0, y: 6, duration: 0.38, ease: "power1.out", stagger: 0.04 });
  }, { dependencies: [active], scope: cardRef });

  // The outgoing artwork wipes away to the left before the next one mounts.
  useGSAP(() => {
    const art = gsap.utils.selector(cardRef)("[data-svc-art]");
    const leaving = active !== shown;
    gsap.to(art, leaving
      ? { opacity: 0, clipPath: "inset(0% 68% 0% 0%)", duration: reduced() ? 0 : 0.16, ease: "power1.in", overwrite: true }
      : { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: reduced() ? 0 : 0.16, overwrite: true, clearProps: "opacity,clipPath" });
  }, { dependencies: [active, shown], scope: cardRef });

  // Keep the outgoing artwork in place for the short exit. Fast selections only
  // start the film for the most recent destination.
  useEffect(() => {
    if (active === shown) return;
    const timer = window.setTimeout(() => setShown(active), reduced() ? 0 : 160);
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
    // scroll-mt-0: the pinned panel already reserves space at the top
    <section id="services" ref={sectionRef} aria-labelledby="services-heading" className="scroll-mt-0!">
      <div
        data-svc-pin
        className="grid content-center bg-white px-5 pt-[86px] pb-16 text-svc-ink lg:min-h-svh lg:px-gutter lg:pt-[110px] lg:pb-7"
      >
        <div className="mx-auto w-[min(100%,1348px)] min-w-0">
          <AnimatedText as="h2"
            id="services-heading"
            className="m-0 text-balance text-center text-[clamp(34px,2.7vw,50px)] font-normal leading-[1.1] tracking-[-0.055em] max-tablet:mx-auto max-tablet:max-w-[19ch]"
          >
            {COUNT} services <span className="text-svc-muted">{SERVICES_SECTION.muted}</span>
          </AnimatedText>
          <ServiceRuler active={active} select={select} />
          <div
            ref={cardRef}
            className="mt-[22px] grid h-[clamp(278px,min(38.6vw,100svh_-_290px),520px)] w-full grid-cols-[minmax(0,5fr)_minmax(0,7fr)] rounded-[34px] bg-[#f3f4f7] p-3.5 shadow-[inset_0_0_26px_10px_rgb(255_255_255/50%)] max-lg:h-auto max-lg:min-h-[330px] max-tablet:mt-3.5 max-tablet:grid-cols-1 max-tablet:rounded-3xl max-tablet:p-[9px]"
            id="svc-panel"
            role="tabpanel"
            aria-labelledby={`svc-tab-${active}`}
            tabIndex={0}
          >
            <div
              className="flex flex-col justify-between px-[clamp(16px,2.2vw,30px)] py-[clamp(18px,2.2vw,30px)] max-tablet:min-h-[210px] max-tablet:gap-6 max-tablet:px-[15px] max-tablet:pt-[18px] max-tablet:pb-[22px]"
              key={service.title}
            >
              <span
                data-svc-enter
                className="grid size-10 flex-none place-items-center rounded-full bg-white font-home-mono text-sm font-medium leading-none text-svc-ink shadow-[0_1px_4px_rgb(35_36_64/5%)] max-tablet:size-8"
                aria-hidden="true"
              >
                {active + 1}
              </span>
              <div>
                <AnimatedText as="h3" className="m-0 text-[clamp(22px,1.55vw,26px)] font-medium leading-[1.2] tracking-[-0.025em]">
                  {service.title}
                </AnimatedText>
                <AnimatedText as="p" className="mt-4 mb-0 max-w-[37ch] text-[clamp(16px,1vw,18px)] leading-normal max-tablet:mt-[9px]">
                  {service.description}
                </AnimatedText>
              </div>
            </div>
            <div className="relative overflow-clip rounded-[20px] bg-[#e8eaf0] max-tablet:aspect-[1.57] max-tablet:rounded-2xl">
              <ServiceArtwork key={shown} artwork={SERVICES[shown].artwork} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
