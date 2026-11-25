import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRightIcon,
  ChatCircleIcon,
  DotsThreeIcon,
  HeartIcon,
  PaperPlaneTiltIcon,
  VideoCameraIcon,
} from "@phosphor-icons/react";
import { HERO, HERO_WALL } from "../constants/homeData";
import { contactClick } from "@/components/contact/contactActions";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Headline lines from homeData, without any "{...}" tokens
const LINES = HERO.titleLines
  .map((line) => line.filter((t) => !t.startsWith("{")).join(" "))
  .filter(Boolean);

/* ---------- Wall layout: a rounded tunnel ----------
   The tiles sit on the inside of an elliptical tube that runs from the screen into the distance,
   with the camera on the tube's axis. That gives the reference's rounded shape: each column is an
   arc (furthest out in the middle, curving in at the top and bottom) and tiles tilt along it.

   Units: U = half the hero width. Camera distance (CSS perspective) = U, tube radius = U.
   A column at "inverse radius" a shows up at U / a pixels from the centre, so near columns are big
   and far ones shrink towards the middle. Tiles are placed every frame by useTunnel(). */
const COLUMNS_PER_SIDE = 4;
const TILES_PER_COLUMN = 14; // enough to cover the visible arc before the loop repeats
const A_START = 0.85; // nearest column (mostly off-screen, peeks in at the corners)
const A_STEP = 0.2; // depth of one column
const HEIGHTS = [1.25, 0.8, 1, 0.7, 1.2, 0.9, 1.05, 0.75, 1.15, 0.85, 1, 0.8, 1.2, 0.9];

// Walk the tile list with a step that shares no factor with its length, so every column cycles
// through all tiles and neighbouring columns start at different ones.
const gcd = (x, y) => (y ? gcd(y, x % y) : x);
const STEP = [5, 7, 3, 2, 1].find((n) => gcd(n, HERO_WALL.length) === 1);
const columnTiles = (column) =>
  Array.from({ length: TILES_PER_COLUMN }, (_, i) => HERO_WALL[(column * 4 + i * STEP) % HERO_WALL.length]);

/* ---------- Tiles (mockups of marketing work) ---------- */
const Avatar = ({ label }) => <span className="wt-avatar">{label.charAt(0)}</span>;

const TileBody = ({ tile }) => {
  switch (tile.kind) {
    case "video":
      return <video className="wt-fill" src={tile.video} poster={tile.poster} muted autoPlay loop playsInline preload="metadata" />;

    case "ad":
      return (
        <div className="wt-ad">
          <div className="wt-head">
            <Avatar label={tile.brand} />
            <span><b>{tile.brand}</b><small>Sponsored</small></span>
            <DotsThreeIcon className="wt-more" />
          </div>
          <p className="wt-copy">{tile.text}</p>
          <img src={tile.image} alt="" />
          <div className="wt-cta"><span>{tile.brand}</span><b>{tile.cta}</b></div>
        </div>
      );

    case "insta":
      return (
        <div className="wt-insta">
          <div className="wt-head"><span className="wt-ring"><Avatar label={tile.handle} /></span><b>{tile.handle}</b><DotsThreeIcon className="wt-more" /></div>
          <img src={tile.image} alt="" />
          <div className="wt-actions"><HeartIcon weight="fill" /><ChatCircleIcon /><PaperPlaneTiltIcon /></div>
          <small className="wt-likes">{tile.likes} likes</small>
        </div>
      );

    case "phone":
      return (
        <div className="wt-phone">
          <div className="wt-screen">
            <img src={tile.image} alt="" />
            <span className="wt-bars"><i /><i /><i /></span>
            <span className="wt-caption">{tile.caption}</span>
          </div>
        </div>
      );

    case "site":
      return (
        <div className={`wt-site${tile.theme === "dark" ? " is-dark" : ""}`}>
          <div className="wt-browser"><i /><i /><i /></div>
          <div className="wt-site-nav"><b>{tile.brand}</b><span /><span /><span /></div>
          <h4>{tile.title}</h4>
          <span className="wt-site-btn">{tile.cta}</span>
          <img src={tile.image} alt="" />
        </div>
      );

    case "dashboard":
      return (
        <div className={`wt-dash is-${tile.theme || "dark"}`}>
          <small>{tile.title}</small>
          <strong>{tile.value}</strong>
          <span className="wt-dash-label">{tile.label} <em>{tile.change}</em></span>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 34 L12 30 L22 32 L34 22 L46 25 L58 15 L70 18 L82 8 L100 4 L100 40 L0 40 Z" className="wt-area" />
            <path d="M0 34 L12 30 L22 32 L34 22 L46 25 L58 15 L70 18 L82 8 L100 4" className="wt-line" />
          </svg>
          <div className="wt-bars-row">{[40, 62, 48, 75, 58, 90, 70].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
        </div>
      );

    case "chat":
      return (
        <div className="wt-chat">
          <div className="wt-chat-head"><Avatar label={tile.name} /><b>{tile.name}</b></div>
          <div className="wt-chat-body">
            {tile.messages.map((m, i) => <p key={i} className={i % 2 ? "is-out" : ""}>{m}</p>)}
          </div>
        </div>
      );

    case "search":
      return (
        <div className="wt-search">
          <div className="wt-search-bar"><span /></div>
          <small><b>Sponsored</b> · {tile.domain}</small>
          <h4>{tile.headline}</h4>
          <p>{tile.text}</p>
          <div className="wt-search-links"><span>Shop now</span><span>New arrivals</span></div>
          <span className="wt-skeleton" /><span className="wt-skeleton is-short" />
        </div>
      );

    case "stat":
      return (
        <div className={`wt-stat is-${tile.theme || "light"}`}>
          <span className="wt-tag">{tile.tag}</span>
          <strong>{tile.stat}</strong>
          <span>{tile.label}</span>
        </div>
      );

    default: // photo
      return <img className="wt-fill" src={tile.image} alt="" decoding="async" />;
  }
};

const Wall = ({ side }) => (
  <div className={`hero-wall is-${side}`}>
    <div className="hero-scene">
      {Array.from({ length: COLUMNS_PER_SIDE }, (_, c) => {
        const column = side === "left" ? c : c + COLUMNS_PER_SIDE;
        return columnTiles(column).map((tile, i) => (
          <div key={`${c}-${i}`} className="hero-tile" data-col={c} data-i={i}>
            <TileBody tile={tile} />
          </div>
        ));
      })}
    </div>
  </div>
);

/* Places every tile on the tunnel and moves them along their arcs. Columns alternate direction,
   drift on their own and speed up while the page is scrolled. */
const useTunnel = (sectionRef) => {
  useEffect(() => {
    const section = sectionRef.current;
    const walls = Array.from(section.querySelectorAll(".hero-wall"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let geo = null;

    const measure = () => {
      const U = section.clientWidth / 2;
      const H = section.clientHeight;
      const kBase = parseFloat(getComputedStyle(section).getPropertyValue("--hero-k")) || 1.6;
      const aMax = A_START + A_STEP * COLUMNS_PER_SIDE;
      // Stretch the tube vertically; on tall screens enough that its "ceiling" stays off-screen.
      const k = Math.max(kBase, (1.15 * (H / 2) * aMax) / U);

      // Arc-length table for the ellipse (x = U cos t, y = kU sin t), t in [-90deg, 90deg]
      const STEPS = 720;
      const ts = new Float32Array(STEPS + 1);
      const ss = new Float32Array(STEPS + 1);
      let s = 0;
      for (let j = 0; j <= STEPS; j++) {
        const t = -Math.PI / 2 + (Math.PI * j) / STEPS;
        if (j > 0) {
          const tm = t - Math.PI / STEPS / 2;
          s += U * Math.hypot(Math.sin(tm), k * Math.cos(tm)) * (Math.PI / STEPS);
        }
        ts[j] = t;
        ss[j] = s;
      }
      const half = s / 2;
      for (let j = 0; j <= STEPS; j++) ss[j] -= half; // s = 0 at the middle row
      const sLimit = half * 0.94;

      const w = 0.985 * A_STEP * U; // tile width = column depth (tiny gap between columns)
      const gap = 0.006 * k * U;
      const columns = Array.from({ length: COLUMNS_PER_SIDE }, (_, c) => {
        const heights = HEIGHTS.map((_, i) => HEIGHTS[(i + c * 3) % HEIGHTS.length] * 0.16 * k * U);
        const starts = [];
        let acc = 0;
        heights.forEach((h) => { starts.push(acc); acc += h + gap; });
        return { z: U * (1 - (A_START + A_STEP * (c + 0.5))), heights, starts, loop: acc };
      });

      walls.forEach((wall) => {
        wall.style.perspective = `${U}px`;
        wall.querySelectorAll(".hero-tile").forEach((el) => {
          const col = columns[el.dataset.col];
          const h = col.heights[el.dataset.i];
          el.style.width = `${w}px`;
          el.style.height = `${h}px`;
          el.style.marginLeft = `${-w / 2}px`;
          el.style.marginTop = `${-h / 2}px`;
        });
      });

      const prev = geo;
      geo = { U, k, ts, ss, sLimit, columns, offsets: prev?.offsets || columns.map((c, i) => (i * 0.37 * c.loop) % c.loop) };
      // tile lists per wall for the frame loop
      geo.tiles = walls.map((wall) => ({
        right: wall.classList.contains("is-right"),
        items: Array.from(wall.querySelectorAll(".hero-tile")).map((el) => ({ el, c: +el.dataset.col, i: +el.dataset.i, hidden: false })),
      }));
    };

    const angleAt = (s) => {
      const { ss, ts } = geo;
      let lo = 0;
      let hi = ss.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (ss[mid] < s) lo = mid; else hi = mid;
      }
      const f = (s - ss[lo]) / (ss[hi] - ss[lo] || 1);
      return ts[lo] + (ts[hi] - ts[lo]) * f;
    };

    const place = () => {
      const { U, k, sLimit, columns, offsets } = geo;
      geo.tiles.forEach(({ right, items }) => {
        // the right wall runs the other way round, so neighbouring columns never move in sync
        const flip = right ? -1 : 1;
        items.forEach((t) => {
          const col = columns[t.c];
          const loop = col.loop;
          const dir = (t.c % 2 ? -1 : 1) * flip;
          let s = ((offsets[t.c] * dir + col.starts[t.i]) % loop + loop) % loop;
          s = s - loop / 2 + col.heights[t.i] / 2;
          const hide = Math.abs(s) > sLimit;
          if (hide !== t.hidden) { t.el.style.visibility = hide ? "hidden" : ""; t.hidden = hide; }
          if (hide) return;
          const a = angleAt(s);
          const x = U * Math.cos(a) * (right ? 1 : -1);
          const y = -k * U * Math.sin(a);
          const tilt = Math.atan2(Math.sin(a) / k, Math.cos(a));
          t.el.style.transform = right
            ? `translate3d(${x}px, ${y}px, ${col.z}px) rotateZ(${-tilt}rad) rotateY(-90deg)`
            : `translate3d(${x}px, ${y}px, ${col.z}px) rotateZ(${tilt}rad) rotateY(90deg)`;
        });
      });
    };

    measure();
    place();

    const ro = new ResizeObserver(() => { measure(); place(); });
    ro.observe(section);
    if (reduce) return () => ro.disconnect();

    let visible = true;
    let boost = 0;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(section);
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => { boost = Math.min(Math.abs(self.getVelocity()) * 0.5, 1200); },
    });
    const SPEED = 26; // px per second along the arc
    const tick = (_time, deltaMs) => {
      if (!visible || !geo) return;
      const dt = Math.min(deltaMs, 50) / 1000;
      boost *= 0.92;
      geo.offsets = geo.offsets.map((o, c) => o + (SPEED + boost) * (1 + c * 0.12) * dt);
      place();
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      trigger.kill();
      io.disconnect();
      ro.disconnect();
    };
  }, [sectionRef]);
};

const useWallMotion = (sectionRef) => {
  useGSAP(() => {
    const section = sectionRef.current;
    const gallery = section.querySelector(".hero-gallery");
    const walls = gallery.querySelectorAll(".hero-wall");
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(walls, {
        yPercent: 105,
        rotation: (index) => index === 0 ? -3 : 3,
        delay: 0.35,
        duration: 1.25,
        stagger: 0.14,
        ease: "power2.out",
      });

      // The headline follows normal page flow. Only the gallery lingers and enlarges.
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
        defaults: { duration: 1 },
      })
        .to(gallery, { yPercent: 22, ease: "none" }, 0)
        .to(walls, {
          scale: () => Number(getComputedStyle(section).getPropertyValue("--wall-zoom")),
          ease: "power2.in",
        }, 0);

      const observer = new IntersectionObserver(([entry]) => {
        gallery.classList.toggle("is-visible", entry.isIntersecting);
      });
      observer.observe(gallery);
      return () => {
        observer.disconnect();
        gallery.classList.remove("is-visible");
      };
    });
    return () => media.revert();
  }, { scope: sectionRef });
};

/* ---------- Hero ---------- */
export const Hero = () => {
  const sectionRef = useRef(null);
  useWallMotion(sectionRef);
  useTunnel(sectionRef);

  return (
    <section className="hero" aria-labelledby="hero-heading" ref={sectionRef}>
      <div className="hero-gallery" aria-hidden="true">
        <Wall side="left" />
        <Wall side="right" />
      </div>

      <div className="hero-content">
        <div className="hero-avatar" data-animate="scale-in" data-start="top bottom">
          {HERO.avatar ? (
            <img src={HERO.avatar} alt="" width="96" height="96" />
          ) : (
            <img src="/svgs/icon.svg" alt="" width="44" height="44" className="hero-avatar-mark" />
          )}
        </div>

        <div className="hero-meta" data-animate="fade-up" data-start="top bottom" data-delay="0.1">
          <span className="hero-name">{HERO.name}</span>
          <span className="hero-status">
            <span className="hero-status-dot" aria-hidden="true" />
            {HERO.status}
          </span>
        </div>

        <h1 id="hero-heading" className="hero-title" data-animate="words" data-start="top bottom" aria-label={LINES.join(" ")}>
          {LINES.map((line, i) => (
            <span key={i} aria-hidden="true" className="block">
              {line.split(" ").map((word, j) => (
                <span key={j} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span className="word-inner inline-block">
                    {word}
                    {" "}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="hero-actions" data-animate="fade-up" data-start="top bottom" data-delay="0.4">
          <Link to="/#contact" onClick={contactClick({ intent: "call" })} className="hero-btn is-dark">
            <VideoCameraIcon size={22} weight="fill" className="hero-btn-icon" aria-hidden="true" />
            {HERO.primaryCta}
          </Link>
          <Link to="/#contact" onClick={contactClick({ intent: "proposal" })} className="hero-btn is-light">
            {HERO.secondaryCta}
            <ArrowRightIcon size={20} aria-hidden="true" />
          </Link>
        </div>

        <p className="hero-since" data-animate="fade-in" data-start="top bottom" data-delay="0.6">
          {HERO.since}
        </p>
      </div>
    </section>
  );
};
