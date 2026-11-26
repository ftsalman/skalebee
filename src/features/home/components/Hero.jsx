import { AnimatedText } from "@/components/common/AnimatedText";
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
import { cn } from "@turtle-ui/utils";
import { HERO, HERO_WALL } from "../constants/homeData";
import { contactClick } from "@/components/contact/contactActions";
import { hoverTo } from "@/hooks/useHoverMotion";

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
const K_BASE = 1.6; // vertical stretch of the tunnel (1 = round)
const HEIGHTS = [1.25, 0.8, 1, 0.7, 1.2, 0.9, 1.05, 0.75, 1.15, 0.85, 1, 0.8, 1.2, 0.9];

// Walk the tile list with a step that shares no factor with its length, so every column cycles
// through all tiles and neighbouring columns start at different ones.
const gcd = (x, y) => (y ? gcd(y, x % y) : x);
const STEP = [5, 7, 3, 2, 1].find((n) => gcd(n, HERO_WALL.length) === 1);
const columnTiles = (column) =>
  Array.from({ length: TILES_PER_COLUMN }, (_, i) => HERO_WALL[(column * 4 + i * STEP) % HERO_WALL.length]);

/* ---------- Tiles (mockups of marketing work) ----------
   Sizes are in cqw: percent of the tile's own width (each tile is a size container). */
const FILL = "block size-full object-cover";
const GROW_IMG = "block min-h-0 w-full flex-1 object-cover";
const HEAD = "flex items-center gap-[3cqw] px-[4cqw] py-[3.5cqw] text-[4cqw] leading-[1.2]";
const MORE = "ml-auto text-[6cqw]";

const Avatar = ({ label }) => (
  <span className="grid size-[9cqw] flex-none place-items-center rounded-full bg-[#171713] text-[4.4cqw] font-bold text-[#ffd400]">
    {label.charAt(0)}
  </span>
);

const DASH = {
  dark: { box: "bg-[#121217] text-white", area: "fill-[rgba(255,212,0,0.18)]", line: "stroke-[#ffd400]", up: "text-[#22c55e]" },
  light: { box: "bg-white text-[#111]", area: "fill-[rgba(8,102,255,0.22)]", line: "stroke-[#3b82f6]", up: "text-[#22c55e]" },
  blue: { box: "bg-[linear-gradient(160deg,#2f6bff,#0a2fb8)] text-white", area: "fill-white/20", line: "stroke-white", up: "text-[#b6ffcb]" },
};
const STAT = {
  yellow: "bg-[#ffd400] text-[#171713]",
  blue: "bg-[linear-gradient(160deg,#2f6bff,#0a2fb8)] text-white",
  dark: "bg-[#171713] text-white",
  light: "bg-[#f2efe8] text-[#171713]",
};

const TileBody = ({ tile }) => {
  switch (tile.kind) {
    case "video":
      return <video className={FILL} src={tile.video} poster={tile.poster} muted autoPlay loop playsInline preload="metadata" />;

    case "ad": // Meta ad
      return (
        <div className="flex h-full flex-col bg-white">
          <div className={HEAD}>
            <Avatar label={tile.brand} />
            <span className="flex flex-col">
              <b>{tile.brand}</b>
              <small className="text-[3.2cqw] text-[#6b6b75]">Sponsored</small>
            </span>
            <DotsThreeIcon className={MORE} />
          </div>
          <p className="m-0 px-[4cqw] pb-[3cqw] text-[3.8cqw] leading-[1.35]">{tile.text}</p>
          <img src={tile.image} alt="" className={GROW_IMG} />
          <div className="flex items-center justify-between bg-[#f0f2f5] px-[4cqw] py-[3.5cqw] text-[3.6cqw]">
            <span>{tile.brand}</span>
            <b className="rounded-[1.5cqw] bg-[#0866ff] px-[3.5cqw] py-[2cqw] text-white">{tile.cta}</b>
          </div>
        </div>
      );

    case "insta": // Instagram post
      return (
        <div className="flex h-full flex-col bg-white">
          <div className={HEAD}>
            <span className="rounded-full bg-[linear-gradient(45deg,#feda75,#d62976,#4f5bd5)] p-[0.8cqw]">
              <Avatar label={tile.handle} />
            </span>
            <b>{tile.handle}</b>
            <DotsThreeIcon className={MORE} />
          </div>
          <img src={tile.image} alt="" className={GROW_IMG} />
          <div className="flex gap-[4cqw] px-[4cqw] pt-[3cqw] pb-[1cqw] text-[7cqw]">
            <HeartIcon weight="fill" className="text-[#ed4956]" />
            <ChatCircleIcon />
            <PaperPlaneTiltIcon />
          </div>
          <small className="px-[4cqw] pb-[3.5cqw] text-[3.6cqw] font-semibold">{tile.likes} likes</small>
        </div>
      );

    case "phone": // Phone story
      return (
        <div className="grid h-full place-items-center bg-[linear-gradient(160deg,#1d1d24,#0b0b0f)]">
          <div className="relative h-[86%] w-[52%] overflow-hidden rounded-[7cqw] border-[2cqw] border-black shadow-[0_4cqw_10cqw_rgba(0,0,0,0.5),0_0_0_0.6cqw_#3a3a44]">
            <img src={tile.image} alt="" className={FILL} />
            <span className="absolute inset-x-[3cqw] top-[3cqw] flex gap-[1cqw]">
              <i className="h-[0.7cqw] flex-1 rounded-[1cqw] bg-white/85" />
              <i className="h-[0.7cqw] flex-1 rounded-[1cqw] bg-white/40" />
              <i className="h-[0.7cqw] flex-1 rounded-[1cqw] bg-white/40" />
            </span>
            <span className="absolute bottom-[6cqw] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[2cqw] bg-white px-[3cqw] py-[1.5cqw] text-[3.6cqw] font-bold">
              {tile.caption}
            </span>
          </div>
        </div>
      );

    case "site": { // Landing page
      const dark = tile.theme === "dark";
      const bar = cn("h-[1.2cqw] w-[8cqw] rounded-[1cqw]", dark ? "bg-[#3a3a44]" : "bg-[#cfcabd]");
      const dot = cn("size-[2.4cqw] rounded-full", dark ? "bg-[#3a3a44]" : "bg-[#c9c4b8]");
      return (
        <div className={cn("flex h-full flex-col", dark ? "bg-[#121217] text-white" : "bg-[#faf8f1]")}>
          <div className={cn("flex gap-[1.5cqw] px-[4cqw] py-[3cqw]", dark ? "bg-[#1f1f26]" : "bg-[#e9e6dd]")}>
            <i className={dot} /><i className={dot} /><i className={dot} />
          </div>
          <div className="flex items-center gap-[3cqw] px-[5cqw] py-[3.5cqw] text-[4cqw]">
            <b>{tile.brand}</b>
            <span className={cn(bar, "ml-auto")} /><span className={bar} /><span className={bar} />
          </div>
          <h4 className="mx-[5cqw] mt-[1cqw] mb-0 text-[7cqw] font-semibold leading-[1.1] tracking-[-0.04em]">{tile.title}</h4>
          <span
            className={cn(
              "mx-[5cqw] my-[4cqw] self-start rounded-full px-[4cqw] py-[2.2cqw] text-[3.4cqw] font-semibold",
              dark ? "bg-[#ffd400] text-[#171713]" : "bg-[#171713] text-[#ffd400]",
            )}
          >
            {tile.cta}
          </span>
          <img src={tile.image} alt="" className="mx-[5cqw] block min-h-0 w-auto flex-1 rounded-t-[2cqw] object-cover" />
        </div>
      );
    }

    case "dashboard": { // Ads dashboard
      const theme = DASH[tile.theme] || DASH.dark;
      return (
        <div className={cn("flex h-full flex-col p-[5cqw]", theme.box)}>
          <small className="text-[3.6cqw] opacity-70">{tile.title}</small>
          <strong className="mt-[3cqw] text-[15cqw] font-semibold leading-none tracking-[-0.05em]">{tile.value}</strong>
          <span className="mt-[2cqw] text-[3.6cqw] opacity-80">
            {tile.label} <em className={cn("ml-[2cqw] font-semibold not-italic", theme.up)}>{tile.change}</em>
          </span>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="mt-auto h-[26%] w-full">
            <path d="M0 34 L12 30 L22 32 L34 22 L46 25 L58 15 L70 18 L82 8 L100 4 L100 40 L0 40 Z" className={theme.area} />
            <path
              d="M0 34 L12 30 L22 32 L34 22 L46 25 L58 15 L70 18 L82 8 L100 4"
              className={cn("fill-none stroke-[1.5] [vector-effect:non-scaling-stroke]", theme.line)}
            />
          </svg>
          <div className="mt-[4cqw] flex h-[14%] items-end gap-[2cqw]">
            {[40, 62, 48, 75, 58, 90, 70].map((h, i) => (
              <i key={i} className="flex-1 rounded-[1cqw] bg-current opacity-25" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      );
    }

    case "chat": // WhatsApp chat
      return (
        <div className="flex h-full flex-col bg-[#efeae2]">
          <div className="flex items-center gap-[3cqw] bg-[#075e54] px-[4cqw] py-[3.5cqw] text-[4cqw] text-white">
            <Avatar label={tile.name} />
            <b>{tile.name}</b>
          </div>
          <div className="flex flex-col gap-[3cqw] px-[4cqw] py-[5cqw]">
            {tile.messages.map((m, i) => (
              <p
                key={i}
                className={cn(
                  "m-0 max-w-[80%] rounded-[3cqw] bg-white px-[3.5cqw] py-[2.5cqw] text-[3.8cqw] leading-[1.35]",
                  i % 2 && "self-end bg-[#d9fdd3]",
                )}
              >
                {m}
              </p>
            ))}
          </div>
        </div>
      );

    case "search": // Google search ad
      return (
        <div className="flex h-full flex-col gap-[2cqw] bg-white p-[5cqw]">
          <div className="mb-[3cqw] h-[9cqw] rounded-full shadow-[0_0.5cqw_2cqw_rgba(0,0,0,0.15)]"><span /></div>
          <small className="text-[3.2cqw] text-[#202124]"><b>Sponsored</b> · {tile.domain}</small>
          <h4 className="m-0 text-[5.6cqw] font-medium leading-[1.2] text-[#1a0dab]">{tile.headline}</h4>
          <p className="m-0 text-[3.6cqw] leading-[1.4] text-[#4d5156]">{tile.text}</p>
          <div className="flex gap-[4cqw] text-[3.4cqw] text-[#1a0dab]"><span>Shop now</span><span>New arrivals</span></div>
          <span className="mt-[3cqw] h-[2cqw] rounded-[1cqw] bg-[#ececef]" />
          <span className="h-[2cqw] w-[60%] rounded-[1cqw] bg-[#ececef]" />
        </div>
      );

    case "stat": // Result card
      return (
        <div className={cn("flex h-full flex-col justify-between p-[5cqw]", STAT[tile.theme] || STAT.light)}>
          <span className="self-start rounded-full border-[0.4cqw] border-current px-[3cqw] py-[1cqw] font-home-mono text-[3cqw] font-medium uppercase leading-[1.4]">
            {tile.tag}
          </span>
          <strong className="text-[17cqw] font-semibold leading-none tracking-[-0.06em]">{tile.stat}</strong>
          <span className="text-[4cqw] leading-[1.3]">{tile.label}</span>
        </div>
      );

    default: // photo
      return <img className={FILL} src={tile.image} alt="" decoding="async" />;
  }
};

// Walls fade out towards the centre (mask), and grow from their outer edge when zooming
const WALL = {
  left: "origin-left [mask-image:linear-gradient(to_right,#000_var(--wall-solid),transparent_var(--wall-edge))]",
  right: "origin-right [mask-image:linear-gradient(to_left,#000_var(--wall-solid),transparent_var(--wall-edge))]",
};

const Wall = ({ side }) => (
  <div data-hero-wall={side} className={cn("absolute inset-0 [perspective-origin:50%_50%]", WALL[side])}>
    <div className="absolute top-1/2 left-1/2 size-0 transform-3d">
      {Array.from({ length: COLUMNS_PER_SIDE }, (_, c) => {
        const column = side === "left" ? c : c + COLUMNS_PER_SIDE;
        return columnTiles(column).map((tile, i) => (
          <div
            key={`${c}-${i}`}
            data-hero-tile
            data-col={c}
            data-i={i}
            // Size and transform are set inline by useTunnel()
            className="@container absolute top-0 left-0 overflow-hidden bg-[#ececef] font-sans text-[#111] backface-hidden will-change-transform"
          >
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
    const walls = Array.from(section.querySelectorAll("[data-hero-wall]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let geo = null;

    const measure = () => {
      const U = section.clientWidth / 2;
      const H = section.clientHeight;
      const aMax = A_START + A_STEP * COLUMNS_PER_SIDE;
      // Stretch the tube vertically; on tall screens enough that its "ceiling" stays off-screen.
      const k = Math.max(K_BASE, (1.15 * (H / 2) * aMax) / U);

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
        wall.querySelectorAll("[data-hero-tile]").forEach((el) => {
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
        right: wall.dataset.heroWall === "right",
        items: Array.from(wall.querySelectorAll("[data-hero-tile]")).map((el) => ({ el, c: +el.dataset.col, i: +el.dataset.i, hidden: false })),
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
    const gallery = section.querySelector("[data-hero-gallery]");
    const walls = gallery.querySelectorAll("[data-hero-wall]");
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

      // The headline follows normal page flow. Only the gallery lingers and enlarges
      // (zoom amount per screen size comes from --wall-zoom on the section).
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
    });
    return () => media.revert();
  }, { scope: sectionRef });
};

const HERO_BTN =
  "inline-flex min-h-[58px] items-center gap-3 rounded-full px-8 text-[18px] font-medium tracking-[-0.01em] max-sm:min-h-[52px] max-sm:px-6 max-sm:text-base";
const LIFT = { "data-hover": "", ...hoverTo({ y: -2, duration: 0.25 }) };

/* ---------- Hero ---------- */
export const Hero = () => {
  const sectionRef = useRef(null);
  useWallMotion(sectionRef);
  useTunnel(sectionRef);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className={cn(
        "relative isolate z-[1] grid min-h-svh place-items-center bg-[linear-gradient(to_bottom,#fff_88%,var(--color-home-paper))] text-[#3d3b52]",
        // Wall mask (solid until, faded by) and scroll zoom, per screen size
        "[--wall-edge:21.5%] [--wall-solid:17%] [--wall-zoom:1.85]",
        "max-lg:[--wall-edge:17%] max-lg:[--wall-solid:10%] max-lg:[--wall-zoom:1.55]",
        "max-sm:[--wall-edge:14%] max-sm:[--wall-solid:4%] max-sm:[--wall-zoom:1.25]",
      )}
    >
      <div
        data-hero-gallery
        className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_89%,transparent)]"
        aria-hidden="true"
      >
        <Wall side="left" />
        <Wall side="right" />
      </div>

      <div className="flex max-w-[900px] flex-col items-center px-6 pt-[110px] pb-[60px] text-center max-sm:max-w-full max-sm:px-7 max-sm:pt-[120px] max-sm:pb-16">
        <div
          className="grid size-[90px] place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,#3a3a33,#111_70%)] max-sm:size-[78px]"
          data-animate="scale-in"
          data-start="top bottom"
        >
          {HERO.avatar ? (
            <img src={HERO.avatar} alt="" width="96" height="96" className="size-full object-cover" />
          ) : (
            <img src="/svgs/icon.svg" alt="" width="44" height="44" className="size-[46%] object-contain" />
          )}
        </div>

        <div className="mt-[26px] flex flex-wrap items-center justify-center gap-3.5" data-animate="fade-up" data-start="top bottom" data-delay="0.1">
          <span className="text-[21px] tracking-[-0.01em] text-[#4a4858] max-sm:text-[18px]">{HERO.name}</span>
          <span className="inline-flex items-center gap-[9px] rounded-full bg-[#f1f1f4] py-1.5 pr-4 pl-[11px] font-home-mono text-sm font-medium leading-[1.4] text-[#4a4858] max-sm:text-xs">
            <span className="size-[13px] rounded-full border-[2.5px] border-[#c4efd2] bg-[#22c55e] bg-clip-padding" aria-hidden="true" />
            {HERO.status}
          </span>
        </div>

        <AnimatedText as="h1" id="hero-heading" aria-label={LINES.join(" ")}
          className="mt-[18px] mb-0 text-[clamp(44px,4.25vw,88px)] font-normal leading-[1.08] tracking-[-0.045em] text-[#3d3b52]">
          {LINES.map((line) => <span key={line} className="block">{line}</span>)}
        </AnimatedText>

        <div className="mt-11 flex flex-wrap justify-center gap-4" data-animate="fade-up" data-start="top bottom" data-delay="0.4">
          <Link
            to="/#contact"
            onClick={contactClick({ intent: "call" })}
            className={cn(
              HERO_BTN,
              "bg-[radial-gradient(120%_90%_at_50%_0%,#3a3a40_0%,#141416_55%,#0a0a0b_100%)] text-white shadow-[0_8px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_6px_rgba(0,0,0,0.6)]",
            )}
            {...LIFT}
          >
            <VideoCameraIcon size={22} weight="fill" className="text-[#ffd400]" aria-hidden="true" />
            {HERO.primaryCta}
          </Link>
          <Link
            to="/#contact"
            onClick={contactClick({ intent: "proposal" })}
            className={cn(
              HERO_BTN,
              "border border-white bg-[linear-gradient(180deg,#f7f7f9,#ececf0)] text-[#3d3b52] shadow-[0_6px_16px_rgba(30,30,60,0.08),inset_0_1px_0_#fff]",
            )}
            {...LIFT}
          >
            {HERO.secondaryCta}
            <ArrowRightIcon size={20} aria-hidden="true" {...hoverTo({ x: 4, duration: 0.25 })} />
          </Link>
        </div>

        <AnimatedText as="p" className="mt-4 font-home-mono text-[15px] font-medium leading-[1.4] text-[#2f2f36]" >
          {HERO.since}
        </AnimatedText>
      </div>
    </section>
  );
};
