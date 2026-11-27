import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowUpRightIcon,
  ListIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react";
import { Drawer } from "@turtle-ui/components";
import { cn } from "@turtle-ui/utils";
import { PillButton } from "@/components/common/PillButton";
import { NAV_LINKS, ROUTES } from "@/constants/constants";
import {
  contactClick,
  openContactModal,
} from "@/components/contact/contactActions";
import { hoverTo } from "@/hooks/useHoverMotion";

gsap.registerPlugin(useGSAP);
const REDUCED = "(prefers-reduced-motion: reduce)";

const sectionId = (to) => (to.includes("#") ? to.split("#")[1] : null);

// On the home page, highlights the link whose section sits in the middle of the screen.
const useActiveSection = (enabled) => {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const sections = NAV_LINKS.map((l) => sectionId(l.to))
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
          else setActive((cur) => (cur === entry.target.id ? null : cur));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => {
      observer.disconnect();
      setActive(null);
    };
  }, [enabled]);

  return enabled ? active : null;
};

// On the home page the dock stays hidden over the hero and slides in once the
// "Platforms we work with" section (#platforms) scrolls into view. Elsewhere it always shows.
const REVEAL_SECTION_ID = "platforms";

const useDockVisible = (enabled) => {
  const [reached, setReached] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const target = document.getElementById(REVEAL_SECTION_ID);
    // Checks position on every scroll (not IntersectionObserver), so jumps straight past
    // the section, like a /#work link, still show the dock.
    // Visible once the section's top is 20% up from the bottom of the screen, or anywhere above.
    let frame = 0;
    const check = () => {
      frame = 0;
      setReached(
        // Section missing: never leave the site without navigation.
        !target ||
          target.getBoundingClientRect().top < window.innerHeight * 0.8,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      setReached(false);
    };
  }, [enabled]);

  return enabled ? reached : true;
};

// Shared sizes: the ghost "plates" row and the real row must match exactly.
const SLOT = "rounded-full p-1.5 max-md:p-[5px]";
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bee-yellow";
const LOGO =
  "grid size-[58px] place-items-center rounded-full bg-[radial-gradient(circle_at_50%_30%,#1d1d21_0%,#08080a_75%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)] max-md:size-[52px]";
const LINKS =
  "relative isolate flex h-[52px] items-center rounded-full bg-[linear-gradient(180deg,#222226_0%,#18181b_100%)] p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.05)] max-md:h-12";
const LINK =
  "relative isolate inline-flex h-11 items-center whitespace-nowrap rounded-full px-4 text-[17px] font-medium tracking-[-0.01em] text-[#96969f] max-md:hidden";
const DIVIDER = "h-5 w-px bg-white/13 max-md:hidden";
const MENU =
  "hidden h-11 items-center gap-2 rounded-full px-4 text-base font-medium text-white max-md:inline-flex max-md:h-10 max-md:px-3.5";
// Glossy pill: dark fill (padding-box) inside a light gradient border (border-box)
const CTA = cn(
  "relative isolate inline-flex h-[52px] items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full border-[1.5px] border-transparent pl-[22px] pr-[26px] text-[18px] font-semibold tracking-[-0.01em] text-white",
  "[background:radial-gradient(120%_130%_at_50%_0%,#28282e_0%,#161619_55%,#101013_100%)_padding-box,conic-gradient(from_var(--dock-sheen,0deg),#55555e,#34343b_30%,#d8d8e6_43%,#47474f_52%,#34343b_80%,#797982)_border-box]",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-3px_8px_rgba(0,0,0,0.6)]",
  "max-md:h-12 max-md:pl-4 max-md:pr-[18px] max-md:text-base",
);

/**
 * One row of the dock. Rendered twice: once as black "plates" that the goo filter melts
 * into a single shape, and once on top with the real links. Both use the same sizes,
 * so the plates always line up with the content.
 */
const DockRow = ({ ghost = false, activeIndex, onMenu }) => {
  const rowRef = useRef(null);
  const linksRef = useRef(null);
  const pillRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [focusIndex, setFocusIndex] = useState(-1);
  const highlight = hoverIndex >= 0 ? hoverIndex : focusIndex >= 0 ? focusIndex : activeIndex;
  const firstRun = useRef(true);
  const Item = ghost ? "span" : Link;
  const itemProps = (props) => (ghost ? {} : props);
  const slot = cn(SLOT, ghost && "bg-[#0c0c0e] [&>*]:invisible");

  // One pill follows the pointer across links, then settles on the current section.
  useGSAP(
    () => {
      if (ghost) return;
      const instant = firstRun.current || window.matchMedia(REDUCED).matches;
      firstRun.current = false;
      const q = gsap.utils.selector(rowRef);
      gsap.to(q("[data-divider]"), {
        opacity: (_, el) => (el.dataset.divider === "show" ? 1 : 0),
        duration: instant ? 0 : 0.25,
        overwrite: true,
      });
      const link = linksRef.current.querySelectorAll("a")[highlight];
      const pill = pillRef.current;
      gsap.to(pill, {
        ...(link && { x: link.offsetLeft, width: link.offsetWidth }),
        autoAlpha: link ? 1 : 0,
        duration: instant ? 0 : 0.24, ease: "power3.out", overwrite: true,
      });
    },
    { scope: rowRef, dependencies: [highlight, ghost] },
  );

  useEffect(() => {
    if (ghost) return;
    const links = linksRef.current;
    const pill = pillRef.current;
    const resize = () => {
      const link = links.querySelector("[data-highlighted]");
      if (link) gsap.set(pill, { x: link.offsetLeft, width: link.offsetWidth });
    };
    const observer = new ResizeObserver(resize);
    observer.observe(links);
    return () => observer.disconnect();
  }, [ghost]);

  useEffect(() => {
    if (ghost) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const turn = gsap.quickSetter(rowRef.current.querySelector("img"), "rotation", "deg");
      // The reference mark turns about 67 degrees over 309 pixels of scrolling.
      const scroll = () => turn(window.scrollY * (67 / 309));
      scroll();
      window.addEventListener("scroll", scroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", scroll);
        turn(0);
      };
    });
    return () => media.revert();
  }, [ghost]);

  return (
    <div
      ref={rowRef}
      className={cn(
        "relative z-[1] flex items-center gap-1.5 [grid-area:1/1]",
        ghost &&
          "pointer-events-none z-0 [filter:url(#dock-goo)_drop-shadow(0_12px_24px_rgba(10,10,20,0.28))]",
      )}
      aria-hidden={ghost || undefined}
    >
      <div className={slot}>
        <Item
          {...itemProps({
            to: ROUTES.HOME,
            "aria-label": "Skalebee home",
            "data-hover": "",
            ...hoverTo({ scale: 1.04, duration: 0.3 }),
          })}
          className={cn(LOGO, FOCUS)}
        >
          <img
            src="/svgs/icon.svg"
            alt=""
            width="100"
            height="100"
            className="size-[34px] max-md:size-[30px]"
          />
        </Item>
      </div>

      <div className={slot}>
        <div className={LINKS} ref={linksRef}
          onPointerLeave={() => setHoverIndex(-1)}
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusIndex(-1); }}>
          {!ghost && <span ref={pillRef} aria-hidden="true" className="invisible absolute inset-y-1 left-0 rounded-full bg-[#2c2c31] opacity-0 max-md:hidden" />}
          {NAV_LINKS.map((item, i) => {
            const isActive = i === activeIndex;
            const showDivider = i !== highlight && i - 1 !== highlight;
            return (
              <Fragment key={item.to}>
                {i > 0 && (
                  <span
                    className={DIVIDER}
                    data-divider={showDivider ? "show" : "hide"}
                  />
                )}
                <Item
                  {...itemProps({
                    to: item.to,
                    "aria-current": isActive ? "location" : undefined,
                    "data-highlighted": highlight === i ? "" : undefined,
                    onPointerEnter: event => { if (event.pointerType !== "touch") setHoverIndex(i); },
                    onFocus: event => { if (event.currentTarget.matches(":focus-visible")) setFocusIndex(i); },
                  })}
                  className={cn(LINK, FOCUS, "motion-safe:transition-colors", highlight === i && "text-white")}
                >
                  {item.label}
                </Item>
              </Fragment>
            );
          })}
          {ghost ? (
            <span className={MENU}>
              <ListIcon size={20} weight="bold" />
              Menu
            </span>
          ) : (
            <button
              type="button"
              className={cn(MENU, FOCUS)}
              aria-label="Open navigation menu"
              onClick={onMenu}
            >
              <ListIcon size={20} weight="bold" aria-hidden="true" />
              Menu
            </button>
          )}
        </div>
      </div>

      <div className={slot}>
        <Item
          {...itemProps({
            to: "/#contact",
            onClick: contactClick({ intent: "call" }),
            "data-hover": "",
            ...hoverTo({ boxShadow: "inset 0 0 9px #777781, 0 0 6px #777781", duration: 0.25 }),
          })}
          className={cn(CTA, FOCUS)}
        >
          {!ghost && <span data-dock-reflection aria-hidden="true"
            className="pointer-events-none absolute -inset-y-1/2 -left-1/2 -z-10 w-1/2 -skew-x-[20deg] bg-[linear-gradient(90deg,transparent,rgba(190,190,212,0.1),transparent)]" />}
          <VideoCameraIcon
            size={24}
            weight="fill"
            className="text-[#ffc93c]"
            aria-hidden="true"
            {...(ghost
              ? {}
              : hoverTo({ scale: 1.12, rotate: -6, duration: 0.25 }))}
          />
          Book a call
        </Item>
      </div>
    </div>
  );
};

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const { pathname } = useLocation();
  const isHome = pathname === ROUTES.HOME;
  const activeSection = useActiveSection(isHome);
  const isVisible = useDockVisible(isHome);
  const onServicePage = pathname.startsWith(ROUTES.SERVICES);
  const activeIndex = NAV_LINKS.findIndex((l) =>
    activeSection
      ? sectionId(l.to) === activeSection
      : l.to === pathname || (onServicePage && sectionId(l.to) === "services"),
  );
  const revealRef = useRef(null);
  const dockRef = useRef(null);
  const settled = useRef(false);

  useGSAP(() => {
    if (!isVisible) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(dockRef.current.querySelector('a[href="/#contact"]'),
        { "--dock-sheen": "0deg" },
        { "--dock-sheen": "360deg", duration: 4, repeat: -1, ease: "none" });
      gsap.fromTo(dockRef.current.querySelector("[data-dock-reflection]"),
        { xPercent: 0 },
        { xPercent: 340, duration: 2.8, repeatDelay: 0.8, repeat: -1, ease: "sine.inOut" });
    });
    return () => media.revert();
  }, { dependencies: [isVisible], revertOnUpdate: true });

  // Entrance: the dock rises in once, on first load.
  useGSAP(() => {
    if (window.matchMedia(REDUCED).matches) return;
    gsap.from(dockRef.current, {
      yPercent: 140,
      autoAlpha: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power3.out",
    });
  });

  // Hide over the home hero, slide back in at the Platforms section. autoAlpha also takes
  // the hidden dock out of keyboard reach. The first state is set without animating.
  useGSAP(
    () => {
      const reduced = window.matchMedia(REDUCED).matches;
      const first = !settled.current;
      settled.current = true;
      if (isVisible) {
        gsap.to(revealRef.current, {
          yPercent: 0,
          autoAlpha: 1,
          duration: first || reduced ? 0 : 0.55,
          ease: "power3.out",
          overwrite: true,
        });
      } else {
        gsap.to(revealRef.current, {
          yPercent: reduced ? 0 : 160,
          autoAlpha: 0,
          duration: first ? 0 : reduced ? 0.2 : 0.45,
          ease: "power2.in",
          overwrite: true,
        });
      }
    },
    { dependencies: [isVisible] },
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 bottom-[18px] z-50 flex justify-center px-2.5 max-md:bottom-3">
      <a
        href="#main-content"
        className="pointer-events-auto sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded focus:bg-bee-yellow focus:p-4 focus:text-black"
      >
        Skip to content
      </a>

      {/* Goo filter: blur + sharpen alpha, so the plates flow into each other with soft necks */}
      <svg
        width="0"
        height="0"
        className="absolute"
        aria-hidden="true"
        focusable="false"
      >
        <filter id="dock-goo" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
          />
        </filter>
      </svg>

      <div ref={revealRef}>
        <nav
          ref={dockRef}
          aria-label="Main navigation"
          className="pointer-events-auto grid"
        >
          <DockRow ghost activeIndex={activeIndex} />
          <DockRow
            activeIndex={activeIndex}
            onMenu={() => setIsMenuOpen(true)}
          />
        </nav>
      </div>

      <div className="pointer-events-auto">
        <Drawer isOpen={isMenuOpen} onToggle={setIsMenuOpen}>
          <Drawer.Header head="Explore Skalebee" onClose={closeMenu} />
          <Drawer.Body>
            <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  data-hover=""
                  {...hoverTo({ backgroundColor: "#ffd400", duration: 0.2 })}
                  className="flex items-center justify-between rounded px-3 py-4 text-2xl text-black"
                >
                  {item.label}
                  <ArrowUpRightIcon size={24} />
                </Link>
              ))}
            </nav>
          </Drawer.Body>
          <Drawer.Footer>
            <PillButton
              to="/#contact"
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                setTimeout(() => openContactModal({ intent: "general" }), 250);
              }}
              block
            >
              Start a conversation
            </PillButton>
          </Drawer.Footer>
        </Drawer>
      </div>
    </header>
  );
};
