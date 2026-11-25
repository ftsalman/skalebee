import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { HeartIcon, VideoCameraIcon } from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";
import { openContactModal } from "@/components/contact/contactActions";
import { hoverTo } from "@/hooks/useHoverMotion";
import { BUILD_CTA, HERO } from "../constants/homeData";

gsap.registerPlugin(useGSAP);

const COLUMNS = 14;
const ROWS = 7;
const STEP = (Math.PI * 2) / COLUMNS;
const CARDS = Array.from({ length: COLUMNS * ROWS }, (_, i) => {
  const row = Math.floor(i / COLUMNS);
  return {
    angle: ((i % COLUMNS) + (row % 2) / 2) * STEP,
    row: row - (ROWS - 1) / 2,
    project: BUILD_CTA.projects[(i * 7 + row * 3) % BUILD_CTA.projects.length],
  };
});

const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const YELLOW_RING = "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-bee-yellow";

function useField(stageRef, selectedRef) {
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = Array.from(stage.children, (el) => ({
      el, front: el.querySelector("[data-bf-front]"), flight: 0,
    }));
    let width, height, radius, spacing, thumbnail, preview;
    let rotation = STEP / 4;
    let velocity = 0;
    let running = 1;
    let drag = null;
    let swallowClick = false;
    let visible = false;

    const draw = (dt) => {
      const selected = selectedRef.current;
      const focused = document.activeElement;
      const paused = selected !== null || drag?.moved || (stage.contains(focused) && focused.matches(":focus-visible"));
      if (selected !== null) velocity = 0;
      running += ((paused ? 0 : 1) - running) * (1 - Math.exp(-9 * dt));
      if (!motion.matches && !drag?.moved) {
        rotation += (velocity - 0.10 * running) * dt;
        velocity *= Math.exp(-5 * dt);
      }

      cards.forEach((card, i) => {
        const { el, front } = card;
        const active = selected === i;
        const target = active ? 1 : 0;
        card.flight = motion.matches ? target :
          target + (card.flight - target) * Math.exp(-(active ? 6 : 10) * dt);
        if (Math.abs(target - card.flight) < 0.001) card.flight = target;

        const t = CARDS[i].angle + rotation;
        const angle = Math.atan2(Math.sin(t), Math.cos(t));
        const hidden = !active && card.flight === 0 && Math.abs(angle) > Math.atan(width / (2 * radius)) + STEP / 2;
        if (el.hidden !== hidden) el.hidden = hidden;
        if (hidden) return;

        // Project the cylindrical slot to the screen, then straighten and enlarge the
        // same card in flight. Both endpoints stay valid if the viewport changes size.
        const depth = Math.cos(angle);
        const slotX = -radius * Math.tan(angle);
        const slotY = CARDS[i].row * spacing / depth;
        const f = card.flight;
        const rest = 1 - f;
        const focusX = clamp(slotX * 0.17, (width - preview) / 2);
        const focusY = clamp(slotY * 0.17, (height - preview * 0.75) / 2);
        const distance = depth * rest + f;
        const x = (slotX * rest + focusX * f) * distance;
        const y = (slotY * rest + focusY * f) * distance;
        const scale = thumbnail / preview * rest + f;
        el.style.transform = `perspective(${radius}px) translate3d(${x}px,${y}px,${radius * (1 - distance)}px) rotateY(${angle * rest}rad) scale(${scale})`;

        const clearance = Math.hypot(slotX / (width * 0.32), slotY / (height * 0.36));
        const alpha = Math.min(1, Math.max(0, (clearance - 0.48) * 1.7));
        el.style.opacity = alpha * rest + f;
        const interactive = active || (alpha > 0.15 && Math.abs(slotX) < width / 2 + thumbnail / 2
          && Math.abs(slotY) < height / 2 + thumbnail / 2);
        el.style.pointerEvents = interactive ? "" : "none";
        const tabIndex = interactive && (selected === null || active) && !front.inert ? 0 : -1;
        if (front.tabIndex !== tabIndex) front.tabIndex = tabIndex;
        el.style.zIndex = active ? 3 : f > 0 ? 2 : 0;
      });
    };

    const measure = () => {
      width = stage.clientWidth;
      height = stage.clientHeight;
      const size = Math.max(width, Math.min(height * 1.5, width * 1.6));
      radius = size * 0.51;
      thumbnail = size * 0.087;
      spacing = Math.max(size * 0.071, height * 0.157);
      preview = Math.min(Math.max(width * 0.29, 292), width - 24, (height - 32) / 0.75);
      stage.style.setProperty("--bf-preview", `${preview}px`);
      draw(0);
    };

    const wheel = (event) => {
      if (event.ctrlKey || stage.getBoundingClientRect().bottom > window.innerHeight + 2) return;
      // The section sits above the footer, so vertical scrolling must keep moving the page
      // (otherwise visitors get stuck here). Vertical wheel turns the cylinder *and* scrolls;
      // only sideways trackpad swipes are kept for the cylinder alone.
      const sideways = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (sideways) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (selectedRef.current !== null) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
      const delta = sideways ? event.deltaX : -event.deltaY;
      const turn = delta * unit / radius;
      if (motion.matches) {
        rotation += turn;
        draw(0);
      } else {
        velocity = clamp(velocity + turn * 5, 5);
      }
    };

    const down = (event) => {
      if (!event.isPrimary || event.button !== 0 || selectedRef.current !== null) return;
      swallowClick = false;
      drag = { id: event.pointerId, start: event.clientX, last: event.clientX, time: event.timeStamp, moved: false };
    };
    const move = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      if (!drag.moved && Math.abs(event.clientX - drag.start) < 6) return;
      drag.moved = true;
      stage.setPointerCapture(event.pointerId);
      stage.classList.add("is-dragging");
      const turn = (drag.last - event.clientX) / radius;
      rotation += turn;
      velocity = clamp(turn * 1000 / Math.max(8, event.timeStamp - drag.time), 5);
      drag.last = event.clientX;
      drag.time = event.timeStamp;
      draw(0);
    };
    const up = (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      swallowClick = drag.moved;
      if (event.type === "pointercancel" || event.timeStamp - drag.time > 80) velocity = 0;
      drag = null;
      stage.classList.remove("is-dragging");
    };
    const click = (event) => {
      if (swallowClick && event.detail > 0) {
        event.stopImmediatePropagation();
        swallowClick = false;
      }
    };
    const tick = (_, ms) => { if (visible) draw(Math.min(ms, 50) / 1000); };
    const resize = new ResizeObserver(measure);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    measure();
    resize.observe(stage);
    visibility.observe(stage);
    gsap.ticker.add(tick);
    const section = stage.closest("[data-bf]");
    section.addEventListener("wheel", wheel, { passive: false });
    stage.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    stage.addEventListener("click", click, true);
    return () => {
      resize.disconnect();
      visibility.disconnect();
      gsap.ticker.remove(tick);
      section.removeEventListener("wheel", wheel);
      stage.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      stage.removeEventListener("click", click, true);
    };
  }, [stageRef, selectedRef]);
}

const FACE =
  "absolute inset-0 overflow-hidden rounded-[clamp(12px,1.05vw,20px)] backface-hidden shadow-[0_0_0_1px_rgb(255_255_255/12%)]";

export const BuildCtaSection = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const ctaRef = useRef(null);
  const selectedRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [flipped, setFlipped] = useState(false);
  useField(stageRef, selectedRef);

  const select = (index) => {
    selectedRef.current = index;
    setSelected(index);
    setFlipped(false);
  };

  // Open card: the others dim and the centre button fades away. The selected card flips
  // to show its details (and flips back when it closes).
  useGSAP(() => {
    const open = selected !== null;
    const fast = reduced();
    const q = gsap.utils.selector(stageRef);
    gsap.to(stageRef.current.children, {
      filter: (i) => (open && i !== selected ? "brightness(0.48)" : "brightness(1)"),
      duration: fast ? 0 : 0.32,
      ease: "power1.out",
      overwrite: "auto",
    });
    q("[data-bf-flip]").forEach((flip, i) => {
      const angle = i === selected && flipped ? 180 : 0;
      if (gsap.getProperty(flip, "rotationY") !== angle) {
        gsap.to(flip, { rotationY: angle, transformPerspective: 1400, duration: fast ? 0 : 0.48, ease: "power3.out", overwrite: true });
      }
    });
    gsap.to(ctaRef.current, {
      opacity: open ? 0 : 1,
      scale: open ? 0.94 : 1,
      duration: fast ? 0 : 0.45,
      ease: "power3.out",
      overwrite: true,
    });
  }, { dependencies: [selected, flipped] });

  useLayoutEffect(() => {
    if (selected === null) return;
    const card = stageRef.current.children[selected];
    card.querySelector(flipped ? "[data-show-image]" : "[data-bf-front]").focus({ preventScroll: true });
  }, [selected, flipped]);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event) => {
      if (event.key !== "Escape" || document.querySelector("dialog[open]")) return;
      const front = stageRef.current.children[selected].querySelector("[data-bf-front]");
      select(null);
      front.inert = false;
      front.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section
      ref={sectionRef}
      data-bf
      aria-labelledby="bf-heading"
      // Tucks under the footer's rounded bottom corners by --bf-overlap
      className="relative z-[1] mt-[calc(-1*var(--bf-overlap))] h-[calc(90svh+var(--bf-overlap))] overflow-clip bg-[#050505] [--bf-overlap:clamp(28px,3vw,48px)]"
    >
      <div className="absolute inset-x-0 top-[var(--bf-overlap)] bottom-0 overflow-clip">
        <div
          ref={stageRef}
          onClick={() => select(null)}
          className="absolute inset-0 cursor-grab [touch-action:pan-y_pinch-zoom] has-[[data-selected]]:cursor-zoom-out [&.is-dragging]:cursor-grabbing [&.is-dragging_*]:cursor-grabbing"
        >
          {CARDS.map(({ project }, i) => {
            const active = selected === i;
            const showBack = active && flipped;
            return (
              <div
                key={i}
                data-selected={active || undefined}
                onClick={(event) => event.stopPropagation()}
                // Position, size and opacity are set every frame by useField()
                className="absolute top-1/2 left-1/2 mt-[calc(var(--bf-preview)*-0.375)] ml-[calc(var(--bf-preview)*-0.5)] aspect-[4/3] w-[var(--bf-preview)]"
              >
                <div data-bf-flip className="relative size-full transform-3d">
                  <button
                    type="button"
                    data-bf-front
                    tabIndex={-1}
                    inert={showBack}
                    aria-label={active ? `Show details for ${project.title}` : project.title}
                    onClick={() => (active ? setFlipped(true) : select(i))}
                    className={cn(FACE, "block size-full cursor-pointer border-0 bg-[#16161a] p-0", YELLOW_RING)}
                  >
                    <img
                      src={project.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      className="pointer-events-none block size-full select-none object-cover"
                    />
                  </button>
                  <div
                    inert={!showBack}
                    className={cn(
                      FACE,
                      "flex flex-col bg-white p-[clamp(18px,2.1vw,42px)] text-[#3d3b52] [transform:rotateY(180deg)]",
                      "has-[[data-show-image]:focus-visible]:outline-3 has-[[data-show-image]:focus-visible]:outline-offset-3 has-[[data-show-image]:focus-visible]:outline-bee-yellow",
                    )}
                  >
                    <button
                      type="button"
                      data-show-image
                      aria-label={`Show image for ${project.title}`}
                      onClick={() => setFlipped(false)}
                      className="absolute inset-0 cursor-pointer border-0 bg-transparent outline-none"
                    />
                    <span className="pointer-events-none flex flex-wrap gap-1.5">
                      {project.tags.map((tag, j) => (
                        <span
                          key={tag}
                          className={cn(
                            "rounded-full px-3 py-[5px] text-[clamp(10px,0.67vw,14px)]",
                            j === 0 ? "bg-[#17171b] text-white" : "bg-[#f0f0f4] text-[#555264]",
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                    <span className="pointer-events-none mt-[0.5em] text-[clamp(17px,1.8vw,36px)] leading-[1.15] tracking-[-0.025em] text-[#6c6a80]">
                      {project.title}
                    </span>
                    <span className="pointer-events-none mt-auto flex items-center justify-between border-t border-[#f0f0f4] pt-[0.65em] text-[clamp(11px,0.87vw,16px)] text-[#777484]">
                      <span>{BUILD_CTA.backPrompt}</span>
                      <button
                        type="button"
                        aria-label="Talk to us about a project like this"
                        onClick={() => openContactModal({ intent: "proposal" })}
                        data-hover=""
                        {...hoverTo({ color: "#ff4d6d", duration: 0.2 })}
                        className={cn(
                          "pointer-events-auto relative grid aspect-square w-[clamp(32px,2.5vw,48px)] cursor-pointer place-items-center rounded-full border-0 bg-[#17171b] text-white",
                          YELLOW_RING,
                        )}
                      >
                        <HeartIcon weight="fill" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          ref={ctaRef}
          inert={selected !== null}
          className={cn(
            // w-max: left:50% would otherwise squeeze it to half the screen
            "absolute top-1/2 left-1/2 z-[2] flex w-max max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[22px]",
            selected !== null && "pointer-events-none",
          )}
        >
          <h2 id="bf-heading" className="m-0 whitespace-nowrap text-[clamp(26px,2vw,34px)] font-normal tracking-[-0.03em] text-white">
            {BUILD_CTA.title}
          </h2>
          <button
            type="button"
            onClick={() => openContactModal({ intent: "call" })}
            data-hover=""
            {...hoverTo({
              scale: 1.03,
              boxShadow: "0 0 0 8px rgba(255,255,255,0.12), 0 26px 70px rgba(0,0,0,0.7), inset 0 -3px 8px rgba(0,0,0,0.08)",
              duration: 0.35,
              ease: "power3.out",
            })}
            className={cn(
              "relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-full border border-white/90 py-2 pr-9 pl-2 text-left text-[#17171b]",
              "bg-[linear-gradient(180deg,#ffffff_0%,#eeeef3_55%,#dcdce4_100%)] shadow-[0_0_0_4px_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.6),inset_0_-3px_8px_rgba(0,0,0,0.08)]",
              "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-bee-yellow max-sm:gap-3 max-sm:py-1.5 max-sm:pr-6 max-sm:pl-1.5",
            )}
          >
            {/* Glossy sheen that sweeps across on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-[linear-gradient(100deg,transparent_30%,rgba(255,255,255,0.9)_48%,transparent_66%)] motion-reduce:hidden"
              {...hoverTo({ xPercent: 240, duration: 0.9, ease: "power1.inOut" })}
            />
            <span className="grid size-16 flex-none place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,#3a3a33,#111_70%)] max-sm:size-12">
              {HERO.avatar ? (
                <img src={HERO.avatar} alt="" className="size-full object-cover" />
              ) : (
                <img src="/svgs/icon.svg" alt="" className="size-[46%] object-contain" />
              )}
            </span>
            <span className="flex flex-col gap-[3px]">
              <span className="inline-flex items-center gap-2.5 whitespace-nowrap text-[clamp(20px,1.45vw,24px)] tracking-[-0.03em] max-sm:text-[18px]">
                {BUILD_CTA.button}
                <VideoCameraIcon weight="fill" className="text-[0.9em] text-[#ffc400]" aria-hidden="true" />
              </span>
              <span className="whitespace-nowrap font-home-mono text-[clamp(12px,0.8vw,14px)] font-medium leading-[1.3] text-[#5e5c70] max-sm:text-[11px]">
                {BUILD_CTA.subtitle}
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
