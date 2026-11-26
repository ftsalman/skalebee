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

// Step label, open (selected) and closed. GSAP plays the change between them.
const LABEL_OPEN = { gridTemplateColumns: "1fr", paddingLeft: 8, paddingRight: 9, opacity: 1, filter: "blur(0px)" };
const LABEL_SHUT = { gridTemplateColumns: "0fr", paddingLeft: 0, paddingRight: 0, opacity: 0, filter: "blur(4px)" };

// Track both ends of the pill independently as the selected tab expands.
// The nearby ruler marks rise and settle as the pill passes them.
function ServiceRuler({ active, select }) {
  const wrapRef = useRef(null);
  const railRef = useRef(null);
  const pillRef = useRef(null);
  const edges = useRef(null);
  const prevActive = useRef(active);

  // The newly selected label opens (and blurs in) while the old one closes.
  useGSAP(() => {
    const from = prevActive.current;
    prevActive.current = active;
    if (from === active || reduced()) return;
    const labels = railRef.current.querySelectorAll("[data-svc-label]");
    const play = (el, start, end) =>
      gsap.fromTo(el, start, { ...end, duration: 0.38, ease: "power1.inOut", clearProps: "gridTemplateColumns,paddingLeft,paddingRight,opacity,filter" });
    play(labels[from], LABEL_OPEN, LABEL_SHUT);
    play(labels[active], LABEL_SHUT, LABEL_OPEN);
  }, { dependencies: [active] });

  useLayoutEffect(() => {
    const rail = railRef.current;
    const wrap = wrapRef.current;
    const pill = pillRef.current;
    const tab = rail.querySelector('[aria-selected="true"]');
    const ticks = Array.from(rail.querySelectorAll("[data-svc-ticks] i"));
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
    <div
      className="mx-auto mt-[clamp(26px,6.2svh,62px)] w-[min(100%,1098px)] overflow-x-auto rounded-full bg-[#f8f8fa] [scrollbar-width:none] max-lg:mt-[34px] [&::-webkit-scrollbar]:hidden"
      ref={wrapRef}
      data-lenis-prevent-horizontal
    >
      <div className="relative isolate flex w-full min-w-max items-center p-2" role="tablist" aria-label="Services" ref={railRef}>
        {/* Black pill that stretches from step to step (above the ticks, below the steps) */}
        <span
          className="pointer-events-none absolute inset-y-2 left-0 z-[1] rounded-full bg-[linear-gradient(180deg,#232328_0%,#111114_100%)] shadow-[inset_0_1px_0_rgb(255_255_255/8%),0_4px_12px_rgb(20_20_30/18%)]"
          ref={pillRef}
          aria-hidden="true"
        />
        {SERVICES.map((service, i) => {
          const selected = active === i;
          const done = i < active;
          return (
            <div className="flex items-center not-last:flex-[1_0_auto]" role="presentation" key={service.title}>
              <button
                type="button"
                role="tab"
                id={`svc-tab-${i}`}
                aria-controls="svc-panel"
                aria-label={service.title}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                className="relative z-[2] flex h-[46px] flex-none items-center rounded-full border-0 bg-transparent px-[7px] text-svc-ink"
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
                <span
                  data-svc-label
                  className={cn(
                    "grid text-[18px] font-semibold leading-none tracking-[-0.025em] max-tablet:text-base",
                    selected ? "grid-cols-[1fr] pr-[9px] pl-2 text-white" : "grid-cols-[0fr] opacity-0 blur-[4px]",
                  )}
                >
                  <span className="overflow-hidden whitespace-nowrap">{service.title}</span>
                </span>
              </button>
              {i < LAST && (
                <span
                  data-svc-ticks
                  className="flex h-[42px] min-w-[45px] flex-[1_0_auto] items-center justify-evenly gap-[3px] max-lg:min-w-[52px]"
                  aria-hidden="true"
                >
                  {/* --near (0 to 1) is set from JS: 1 right beside the pill, 0 far away */}
                  {TICKS.map((k) => (
                    <i
                      key={k}
                      className="h-4 w-[1.5px] rounded-[1px] bg-[color-mix(in_srgb,#6f7084_calc(var(--near,0)*100%),var(--tick))] [--tick:#dcdde5] [&.is-passed]:[--tick:#b3b4c3]"
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
