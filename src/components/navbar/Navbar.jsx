import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
import "./navbar.css";

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
        !target || target.getBoundingClientRect().top < window.innerHeight * 0.8,
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

/**
 * One row of the dock. Rendered twice: once as black "plates" that the goo filter melts
 * into a single shape, and once on top with the real links. Both use the same sizes,
 * so the plates always line up with the content.
 */
const DockRow = ({ ghost = false, activeIndex, onMenu }) => {
  const Item = ghost ? "span" : Link;
  const itemProps = (props) => (ghost ? {} : props);

  return (
    <div
      className={cn("dock-row", ghost && "is-plates")}
      aria-hidden={ghost || undefined}
    >
      <div className="dock-slot is-round">
        <Item
          {...itemProps({ to: ROUTES.HOME, "aria-label": "Skalebee home" })}
          className="dock-logo"
        >
          <img src="/svgs/icon.svg" alt="" width="100" height="100" />
        </Item>
      </div>

      <div className="dock-slot">
        <div className="dock-links">
          {NAV_LINKS.map((item, i) => {
            const isActive = i === activeIndex;
            const showDivider =
              i > 0 && i !== activeIndex && i - 1 !== activeIndex;
            return (
              <Fragment key={item.to}>
                {i > 0 && (
                  <span
                    className={cn("dock-divider", !showDivider && "is-hidden")}
                  />
                )}
                <Item
                  {...itemProps({
                    to: item.to,
                    "aria-current": isActive ? "location" : undefined,
                  })}
                  className={cn("dock-link", isActive && "is-active")}
                >
                  {item.label}
                </Item>
              </Fragment>
            );
          })}
          {ghost ? (
            <span className="dock-menu">
              <ListIcon size={20} weight="bold" />
              Menu
            </span>
          ) : (
            <button
              type="button"
              className="dock-menu"
              aria-label="Open navigation menu"
              onClick={onMenu}
            >
              <ListIcon size={20} weight="bold" aria-hidden="true" />
              Menu
            </button>
          )}
        </div>
      </div>

      <div className="dock-slot">
        <Item
          {...itemProps({
            to: "/#contact",
            onClick: contactClick({ intent: "call" }),
          })}
          className="dock-cta"
        >
          <VideoCameraIcon
            size={24}
            weight="fill"
            className="dock-cta-icon"
            aria-hidden="true"
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
  const activeIndex = NAV_LINKS.findIndex((l) =>
    activeSection ? sectionId(l.to) === activeSection : l.to === pathname,
  );

  return (
    <header className="dock-wrap">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded focus:bg-bee-yellow focus:p-4 focus:text-black"
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

      <div className={cn("dock-reveal", !isVisible && "is-hidden")}>
        <nav aria-label="Main navigation" className="dock">
          <DockRow ghost activeIndex={activeIndex} />
          <DockRow activeIndex={activeIndex} onMenu={() => setIsMenuOpen(true)} />
        </nav>
      </div>

      <Drawer isOpen={isMenuOpen} onToggle={setIsMenuOpen}>
        <Drawer.Header head="Explore Skalebee" onClose={closeMenu} />
        <Drawer.Body>
          <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className="flex items-center justify-between rounded px-3 py-4 text-2xl text-black hover:bg-bee-yellow"
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
    </header>
  );
};
