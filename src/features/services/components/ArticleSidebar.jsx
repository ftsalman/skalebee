import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CaretLeftIcon } from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";
import { hoverTo } from "@/hooks/useHoverMotion";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bee-yellow";

// Index of the section currently being read: the last one whose top has passed 40% of the
// screen height. Before the first section, the first link stays highlighted.
const useActiveSection = (ids) => {
  const [active, setActive] = useState(0);
  const key = ids.join("|");

  useEffect(() => {
    const sections = key.split("|").map((id) => document.getElementById(id));
    let frame = 0;
    const check = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = 0;
      sections.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Lazy images loading in move the sections without a scroll event.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key]);

  return active;
};

const scrollToSection = (event, id) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  if (window.__lenis) window.__lenis.scrollTo(target, { offset: -40 });
  else target.scrollIntoView({ behavior: "instant", block: "start" });
  target.focus({ preventScroll: true });
};

/** White "‹ Back" pill. */
export const BackPill = ({ to, label = "Back", className }) => (
  <Link
    to={to}
    data-hover=""
    {...hoverTo({ boxShadow: "0 4px 14px rgba(30,32,60,0.16), 0 0 0 1px rgba(30,32,60,0.06)", duration: 0.25 })}
    className={cn(
      "inline-flex h-12 items-center gap-2.5 rounded-full bg-white pr-5 pl-4 text-[19px] leading-none tracking-[-0.01em] text-[#3d3e52]",
      "shadow-[0_2px_8px_rgba(30,32,60,0.12),0_0_0_1px_rgba(30,32,60,0.04)]",
      FOCUS,
      className,
    )}
  >
    <CaretLeftIcon size={20} aria-hidden="true" {...hoverTo({ x: -3, duration: 0.25 })} />
    {label}
  </Link>
);

/**
 * Sticky left column: Back pill, a short rule, then the table of contents.
 * Shown from 1280px up; below that the page shows a BackPill above its title instead.
 *   items: [{ id, label }]  ids of the sections on the page
 */
export const ArticleSidebar = ({ back, items, label = "On this page" }) => {
  const active = useActiveSection(items.map((item) => item.id));

  return (
    <aside className="pointer-events-none absolute inset-y-0 left-[clamp(22px,2.7vw,51px)] hidden w-[180px] pt-[clamp(96px,8.9vw,170px)] min-[1280px]:block">
      <div className="pointer-events-auto sticky top-[118px]">
        <BackPill {...back} />
        <hr className="mt-8 mb-0 w-[180px] border-0 border-t border-[#e4e5ec]" />
        <nav aria-label={label} className="mt-[38px]">
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            {items.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => scrollToSection(event, item.id)}
                  aria-current={i === active ? "location" : undefined}
                  className={cn(
                    "block max-w-[172px] text-balance text-[17px] leading-[27px] tracking-[-0.005em] text-[#7a7c95] motion-safe:transition-colors motion-safe:duration-300 hover:text-[#3e3f55]",
                    i === active && "text-[#3e3f55]",
                    FOCUS,
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
