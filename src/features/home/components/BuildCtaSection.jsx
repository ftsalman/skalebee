import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { HeartIcon, VideoCameraIcon } from "@phosphor-icons/react";
import { openContactModal } from "@/components/contact/contactActions";
import { BUILD_CTA, HERO } from "../constants/homeData";
import "../page/Home.css";

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

function useField(stageRef, selectedRef) {
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = Array.from(stage.children, (el) => ({
      el, front: el.querySelector(".bf-front"), flight: 0,
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
    const section = stage.closest(".bf");
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

export const BuildCtaSection = () => {
  const stageRef = useRef(null);
  const selectedRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [flipped, setFlipped] = useState(false);
  useField(stageRef, selectedRef);

  const select = (index) => {
    selectedRef.current = index;
    setSelected(index);
    setFlipped(false);
  };

  useLayoutEffect(() => {
    if (selected === null) return;
    const card = stageRef.current.children[selected];
    card.querySelector(flipped ? ".bf-show-image" : ".bf-front").focus({ preventScroll: true });
  }, [selected, flipped]);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event) => {
      if (event.key !== "Escape" || document.querySelector("dialog[open]")) return;
      const front = stageRef.current.children[selected].querySelector(".bf-front");
      select(null);
      front.inert = false;
      front.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section className={`bf${selected !== null ? " is-open" : ""}`} aria-labelledby="bf-heading">
      <div className="bf-fixed">
        <div className="bf-stage" ref={stageRef} onClick={() => select(null)}>
          {CARDS.map(({ project }, i) => {
            const active = selected === i;
            const showBack = active && flipped;
            return (
              <div key={i} className={`bf-card${active ? " is-selected" : ""}`}
                onClick={(event) => event.stopPropagation()}>
                <div className={`bf-flip${showBack ? " is-flipped" : ""}`}>
                  <button type="button" className="bf-face bf-front" tabIndex={-1} inert={showBack}
                    aria-label={active ? `Show details for ${project.title}` : project.title}
                    onClick={() => active ? setFlipped(true) : select(i)}>
                    <img src={project.image} alt="" loading="lazy" decoding="async" draggable="false" />
                  </button>
                  <div className="bf-face bf-back" inert={!showBack}>
                    <button className="bf-show-image" type="button" aria-label={`Show image for ${project.title}`}
                      onClick={() => setFlipped(false)} />
                    <span className="bf-tags">
                      {project.tags.map((tag, j) => <span key={tag} className={j === 0 ? "is-dark" : ""}>{tag}</span>)}
                    </span>
                    <span className="bf-back-title">{project.title}</span>
                    <span className="bf-back-foot">
                      <span>{BUILD_CTA.backPrompt}</span>
                      <button type="button" className="bf-like" aria-label="Talk to us about a project like this"
                        onClick={() => openContactModal({ intent: "proposal" })}>
                        <HeartIcon weight="fill" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bf-cta" inert={selected !== null}>
          <h2 id="bf-heading">{BUILD_CTA.title}</h2>
          <button type="button" className="bf-pill" onClick={() => openContactModal({ intent: "call" })}>
            <span className="bf-pill-avatar">
              {HERO.avatar ? <img src={HERO.avatar} alt="" /> : <img src="/svgs/icon.svg" alt="" className="bf-pill-mark" />}
            </span>
            <span className="bf-pill-text">
              <span className="bf-pill-title">
                {BUILD_CTA.button}
                <VideoCameraIcon weight="fill" className="bf-pill-icon" aria-hidden="true" />
              </span>
              <span className="bf-pill-sub">{BUILD_CTA.subtitle}</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
