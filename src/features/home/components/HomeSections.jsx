import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowUpRightIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";
import { PillButton } from "@/components/common/PillButton";
import { Marquee } from "@/components/common/Marquee";
import { hoverTo } from "@/hooks/useHoverMotion";
import {
  CASE_STUDIES,
  FEATURED_WORK,
  STATS,
  TESTIMONIALS,
  WHY_US,
} from "../constants/homeData";
import { MUTED, SECTION, SECTION_HEADING } from "./homeStyles";
import { SectionLabel, SectionTitle, TextLink } from "./homeUi";

gsap.registerPlugin(useGSAP);
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The next testimonial fades up a little
const contentIn = (el, duration = 0.3) => {
  if (el && !reduceMotion()) gsap.from(el, { autoAlpha: 0, y: 8, duration, ease: "power1.out" });
};

export const BrandStrip = () => (
  <section className="border-b border-home-line pt-[42px] pb-12 max-tablet:py-[30px]" aria-label="Brands we work with">
    <SectionLabel className="mb-[30px] justify-center">Brands we work with</SectionLabel>
    <Marquee
      duration={32}
      pauseOnHover
      className="[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
    >
      {/* Repeated so the strip is always full */}
      {[...CASE_STUDIES, ...CASE_STUDIES, ...CASE_STUDIES].map(({ client }, i) => (
        <span
          className="inline-flex items-center gap-[50px] pr-[50px] text-[clamp(28px,3vw,42px)] font-medium leading-[1.2] tracking-[-0.05em] max-tablet:gap-[30px] max-tablet:pr-[30px]"
          key={`${client}-${i}`}
        >
          {client}
          <img src="/svgs/icon.svg" width="28" height="28" alt="" className="size-[25px] grayscale" />
        </span>
      ))}
    </Marquee>
  </section>
);

// Logo surfaces for projects without a screenshot (cards + project popup)
const LOGO_THEMES = {
  dark: "bg-[radial-gradient(90%_70%_at_50%_35%,#3a3a3f_0%,transparent_70%),repeating-linear-gradient(180deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_3px),linear-gradient(180deg,#2a2a2e,#0e0e10)] text-white",
  light: "bg-[radial-gradient(80%_70%_at_50%_30%,#ffffff_0%,transparent_70%),linear-gradient(180deg,#eef0f4,#d9dce3)] text-[#111]",
  yellow: "bg-[radial-gradient(80%_70%_at_50%_25%,#fff1a6_0%,transparent_65%),linear-gradient(180deg,#ffd84a,#f6b90f)] text-[#111]",
};

// Card visual: a video or screenshot if the project has one, otherwise its logo on a coloured surface.
// `className` sizes the media; extra props (e.g. hover motion) go on the outer element.
const ProjectVisual = ({ project, className, ...props }) => {
  if (project.video) {
    return (
      <video
        src={project.video}
        poster={project.image}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-label={`${project.client} project`}
        className={className}
        {...props}
      />
    );
  }
  if (project.image) {
    return (
      <img src={project.image} alt={`${project.client} project`} loading="lazy" width="1400" height="1050" className={className} {...props} />
    );
  }
  return (
    <span
      className={cn("grid size-full min-h-[220px] place-items-center", LOGO_THEMES[project.theme] || LOGO_THEMES.dark, className)}
      {...props}
    >
      {project.logo ? (
        <img src={project.logo} alt={`${project.client} logo`} loading="lazy" className="max-h-[30%] w-auto max-w-[42%] object-contain" />
      ) : (
        <b className="text-[clamp(56px,9vw,150px)] font-medium leading-none tracking-[-0.06em]">{project.client}</b>
      )}
    </span>
  );
};

const ProjectDialog = ({ project, onClose }) => {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = oldOverflow;
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto max-h-[88dvh] w-[min(900px,calc(100%-32px))] overflow-auto rounded-[10px] border-0 bg-home-paper p-0 text-home-ink shadow-[0_30px_100px_#0005] backdrop:bg-[#111b] backdrop:backdrop-blur-[8px]"
      onClose={(event) => {
        if (!event.currentTarget.open) onClose();
      }}
      aria-labelledby="project-dialog-title"
      data-lenis-prevent
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const box = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="absolute top-4 right-4 z-[2] grid size-11 cursor-pointer place-items-center rounded-full bg-home-paper text-home-ink"
        aria-label="Close project"
        onClick={onClose}
        autoFocus
      >
        <XIcon size={24} />
      </button>
      {/* Shown whole (posters are tall) on a soft backdrop */}
      <div className="grid h-[330px] place-items-center overflow-hidden bg-[#ecebe6]">
        <ProjectVisual project={project} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="p-[clamp(24px,5vw,48px)]">
        <SectionLabel>Client</SectionLabel>
        <h2 id="project-dialog-title" className="mt-4 mb-[5px] text-[clamp(30px,5vw,52px)] font-normal tracking-[-0.05em]">
          {project.client}
        </h2>
        <p className="text-sm leading-[1.7]">{project.category}</p>
        {project.note && <p className={cn("text-sm leading-[1.7]", MUTED)}>{project.note}</p>}
        <PillButton to="/#contact" onClick={onClose} className="mt-[25px]">
          Discuss a similar project
        </PillButton>
      </div>
    </dialog>
  );
};

// Cards without a photo or video sit on a light/yellow surface, so their text turns dark.
const isLightCard = (project) => !project.image && !project.video && project.theme !== "dark";
const WORK_PREVIEW_COUNT = 6;
const MEDIA_ZOOM = hoverTo({ scale: 1.035, duration: 0.9, ease: "power3.out" });

const WorkCard = ({ project, onOpen }) => {
  const light = isLightCard(project);
  const tags = project.tags?.length ? project.tags : [project.category];
  return (
    <article
      data-hover=""
      className={cn(
        "relative isolate aspect-[4/3] overflow-hidden rounded-[clamp(20px,1.6vw,30px)] bg-[#1a1a1c] text-white [--card-pad:clamp(18px,1.9vw,36px)]",
        // An odd last card takes the full row, in a wider frame
        "last:odd:col-span-full last:odd:aspect-[8/3] max-md:aspect-[4/4.2] max-md:last:odd:aspect-[4/4.2]",
        // Bottom shade keeps the title and tags readable on any image
        "after:pointer-events-none after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.42)_100%)] after:content-['']",
        light && "text-[#111] after:hidden",
      )}
    >
      <div className="absolute inset-0">
        {project.fit === "contain" && project.image ? (
          <>
            {/* Blurred copy fills the card; the piece itself sits whole in the middle */}
            <span
              className="absolute -inset-[12%] bg-cover bg-center blur-[42px] brightness-[0.92] saturate-[1.3]"
              style={{ backgroundImage: `url(${project.image})` }}
              aria-hidden="true"
            />
            <img
              className="absolute top-[7%] left-1/2 h-[76%] w-auto max-w-[70%] origin-bottom -translate-x-1/2 rounded-[clamp(10px,0.9vw,16px)] object-contain shadow-[0_24px_50px_rgba(0,0,0,0.28),0_4px_12px_rgba(0,0,0,0.12)]"
              src={project.image}
              alt={`${project.client} project`}
              loading="lazy"
              {...hoverTo({ scale: 1.04, duration: 0.9, ease: "power3.out" })}
            />
          </>
        ) : (
          <ProjectVisual project={project} className="size-full object-cover" {...MEDIA_ZOOM} />
        )}
      </div>

      {/* "View project" pill: hidden until hover (always shown on touch screens) */}
      <span
        className="pointer-events-none absolute top-[clamp(14px,1.1vw,20px)] right-[clamp(14px,1.1vw,20px)] z-[2] inline-flex -translate-y-2 items-center gap-2.5 rounded-full bg-white py-[11px] pr-4 pl-[18px] text-[17px] font-medium tracking-[-0.01em] text-[#111] opacity-0 shadow-[0_6px_18px_rgba(0,0,0,0.12)] max-md:px-3.5 max-md:py-[9px] max-md:text-[15px] [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
        aria-hidden="true"
        {...hoverTo({ opacity: 1, y: 8, duration: 0.35, ease: "power3.out" })}
      >
        View project <ArrowUpRightIcon size={18} />
      </span>

      <div className="pointer-events-none absolute inset-x-[var(--card-pad)] bottom-[var(--card-pad)] z-[2] flex items-end justify-between gap-5 max-md:flex-col max-md:items-start max-md:gap-3.5">
        <h3
          className={cn(
            "text-[clamp(26px,2.1vw,40px)] font-medium leading-none tracking-[-0.04em]",
            light ? "[text-shadow:none]" : "[text-shadow:0_2px_16px_rgba(0,0,0,0.18)]",
          )}
        >
          {project.client}
        </h3>
        <ul className="m-0 flex list-none flex-col items-end gap-2.5 p-0 max-md:flex-row max-md:flex-wrap max-md:items-start" aria-label="Services">
          {tags.map((tag) => (
            <li
              key={tag}
              className={cn(
                // Frosted glass tag
                "whitespace-nowrap rounded-full border px-4 py-2 text-[clamp(14px,0.95vw,17px)] font-medium leading-[1.2] backdrop-blur-[14px] backdrop-saturate-[1.4]",
                light
                  ? "border-black/14 bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                  : "border-white/38 bg-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]",
              )}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {/* Covers the whole card so any click opens the project */}
      <button
        type="button"
        className="absolute inset-0 z-[3] w-full rounded-[inherit] focus-visible:outline-offset-[-5px]! focus-visible:outline-home-accent!"
        onClick={() => onOpen(project)}
        aria-label={`View project: ${project.client}`}
      />
    </article>
  );
};

export const FeaturedWork = () => {
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const projects = showAll ? FEATURED_WORK : FEATURED_WORK.slice(0, WORK_PREVIEW_COUNT);
  const hasMore = FEATURED_WORK.length > WORK_PREVIEW_COUNT && !showAll;
  // Label and heading keep the page gutter while the cards run wider
  const inset = "px-2.5 tablet:px-[calc(var(--spacing-gutter)-clamp(12px,2.6vw,52px))]";

  return (
    <section
      className={cn(SECTION, "tablet:px-[clamp(12px,2.6vw,52px)]")}
      id="work"
      aria-labelledby="work-heading"
    >
      <SectionLabel className={inset}>Selected work</SectionLabel>
      <div className={cn(SECTION_HEADING, inset)}>
        <div id="work-heading">
          <SectionTitle>Brands we’ve helped grow.</SectionTitle>
        </div>
        <TextLink to="/#contact">Start a project</TextLink>
      </div>

      <div className="grid grid-cols-2 gap-1.5 max-md:grid-cols-1">
        {projects.map((project) => (
          <WorkCard key={project.client} project={project} onOpen={setSelected} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            data-hover=""
            {...hoverTo({ y: -2, duration: 0.25 })}
            className="rounded-full border border-white bg-[linear-gradient(180deg,#f7f7f9,#ececf0)] px-[30px] py-3.5 text-[17px] font-medium text-[#2f2f36] shadow-[0_6px_16px_rgba(30,30,60,0.08),inset_0_1px_0_#fff]"
          >
            Show more
          </button>
        </div>
      )}

      {selected && <ProjectDialog project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};

const LINE = "border-home-line";

export const AboutSection = () => (
  <section className={SECTION} id="about" aria-labelledby="about-heading">
    <SectionLabel>About Skalebee</SectionLabel>
    <div
      className="grid grid-cols-[1.5fr_1fr] items-end gap-[12%] max-lg:gap-[7%] max-tablet:grid-cols-1 max-tablet:gap-[35px]"
      id="about-heading"
    >
      <SectionTitle>A Meta-certified team for the UAE and India.</SectionTitle>
      <p className="max-w-[330px] pb-1.5 text-[19px] leading-normal max-lg:text-base max-tablet:max-w-full max-tablet:text-[17px]">
        {WHY_US.description}
      </p>
    </div>
    <div
      className={cn(
        "mt-[68px] grid grid-cols-4 border-y py-[35px] max-tablet:mt-[35px] max-tablet:grid-cols-2 max-tablet:gap-y-[30px] max-tablet:py-7",
        LINE,
      )}
      data-animate="stagger"
    >
      {STATS.map((stat) => (
        <div
          className={cn(
            "flex flex-col gap-[15px] border-l px-[25px] first:border-l-0 first:pl-0 max-tablet:gap-3 max-tablet:px-[22px] max-tablet:first:pl-0 max-tablet:nth-3:border-l-0 max-tablet:nth-3:pl-0",
            LINE,
          )}
          key={stat.label}
        >
          <strong className="text-[clamp(42px,5.9vw,86px)] font-normal leading-none tracking-[-0.07em] max-tablet:text-[57px]">
            <span data-counter={stat.value} data-decimals={stat.decimals || 0}>
              {stat.value}
            </span>
            {stat.suffix}
          </strong>
          <span className="text-xs text-[#67675e] max-tablet:text-[11px]">{stat.label}</span>
        </div>
      ))}
    </div>
    <div className="mt-[90px] grid grid-cols-[0.9fr_1fr] items-center gap-[11%] max-lg:gap-[6%] max-tablet:mt-[45px] max-tablet:grid-cols-1 max-tablet:gap-[35px]">
      <div className="relative aspect-[0.88] overflow-hidden rounded-[7px] bg-[#d6d0c3] max-tablet:aspect-[0.95]" data-home-parallax-frame>
        <img
          src="/imgs/brand/shakkeer.webp"
          alt="Hand-drawn portrait of Shakkeer, founder of Skalebee"
          width="760"
          height="971"
          loading="lazy"
          data-home-parallax
          className="absolute -top-[8%] h-[116%] w-full object-cover object-[center_33%]"
        />
        <div className="absolute inset-x-[18px] bottom-[18px] flex items-center justify-between rounded bg-home-paper p-[17px] text-[13px]">
          <span>Hi, I’m Shakkeer. Meta certified.</span>
          <img src="/svgs/icon.svg" alt="" width="32" height="32" />
        </div>
      </div>
      <div data-animate="fade-up">
        <SectionLabel>{WHY_US.eyebrow}</SectionLabel>
        <h3 className="my-[25px] text-[clamp(32px,3.4vw,50px)] font-normal leading-[1.1] tracking-[-0.055em] max-tablet:text-[38px]">
          {WHY_US.title}
        </h3>
        <p className="my-[15px] text-[15px] leading-[1.8] text-[#66665c]">
          Skalebee helps businesses get more customers online, and actually
          close them. We are a brand of Sharaco Technologies Pvt Ltd, based in
          Pattambi, Kerala, and working with businesses in Dubai, across the UAE
          and throughout India.
        </p>
        <p className="my-[15px] text-[15px] leading-[1.8] text-[#66665c]">
          Sales over vanity: likes and clicks are nice, but leads, bookings and
          revenue are what we report on. You own your ad accounts and data, and
          our fee and your ad budget are always shown separately.
        </p>
        <ul className={cn("my-[26px] border-t pt-[17px]", LINE)}>
          {WHY_US.points.map((point) => (
            <li key={point} className="flex items-start gap-3 py-2 text-[13px]">
              <CheckIcon size={18} aria-hidden="true" className="shrink-0" />
              {point}
            </li>
          ))}
        </ul>
        <PillButton to="/#contact" className="max-tablet:w-full">
          Get a free growth audit
        </PillButton>
      </div>
    </div>
    <div className={cn("mt-[90px] border-t pt-[30px] max-tablet:mt-[45px]", LINE)}>
      <SectionLabel>Where we make it happen</SectionLabel>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-[25px] max-tablet:justify-start max-tablet:gap-x-7 max-tablet:gap-y-[18px]">
        {["Google", "Meta", "Instagram", "Facebook", "WhatsApp"].map((name) => (
          <span key={name} className="text-[clamp(20px,2.8vw,38px)] font-medium tracking-[-0.05em] max-tablet:text-[25px]">
            {name}
          </span>
        ))}
      </div>
    </div>
  </section>
);

const MONO_SMALL = "font-home-mono font-medium";
export const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const contentRef = useRef(null);
  const firstQuote = useRef(true);
  // The quote fades up each time it changes
  useGSAP(() => {
    if (firstQuote.current) {
      firstQuote.current = false;
      return;
    }
    contentIn(contentRef.current, 0.35);
  }, { dependencies: [current] });

  // Only real testimonials: the section stays hidden until TESTIMONIALS has entries
  if (!TESTIMONIALS.length) return null;
  const quote = TESTIMONIALS[current];
  const navButton =
    "grid size-[45px] place-items-center rounded-full border border-[#bcbcaf]";
  const navHover = { "data-hover": "", ...hoverTo({ backgroundColor: "#ffd400", borderColor: "#ffd400", duration: 0.25 }) };
  return (
    <section className={SECTION} aria-labelledby="testimonials-heading">
      <SectionLabel>Good words</SectionLabel>
      <div className={SECTION_HEADING}>
        <div id="testimonials-heading">
          <SectionTitle>Better together. In their words.</SectionTitle>
        </div>
      </div>
      <div className={cn("grid grid-cols-[0.7fr_1.3fr] overflow-hidden rounded-md border max-lg:grid-cols-[0.6fr_1fr] max-tablet:grid-cols-1", LINE)}>
        <div
          className="flex min-h-[430px] flex-col items-center justify-center gap-[35px] bg-[#dedbcf] p-10 max-lg:p-[25px] max-tablet:min-h-[170px] max-tablet:flex-row max-tablet:gap-[25px]"
          aria-hidden="true"
        >
          <img
            src="/svgs/logo-stacked.svg"
            alt=""
            width="250"
            height="250"
            className="max-h-[200px] w-[min(200px,70%)] object-contain max-tablet:max-h-[110px] max-tablet:w-[110px]"
          />
          <span className={cn(MONO_SMALL, "text-center text-[10px] uppercase max-tablet:max-w-[110px] max-tablet:text-left max-tablet:leading-[1.6]")}>
            Made of good partnerships.
          </span>
        </div>
        <div className="flex min-w-0 flex-col justify-between p-[clamp(25px,4vw,65px)] max-tablet:p-7">
          <div aria-live="polite" aria-atomic="true" ref={contentRef} key={current}>
            <blockquote className="min-h-[205px] text-[clamp(23px,2.7vw,39px)] leading-[1.28] tracking-[-0.045em] max-lg:min-h-[180px] max-tablet:min-h-[210px] max-tablet:text-[27px]">
              “{quote.quote}”
            </blockquote>
            <div className="mt-[22px] flex items-center gap-3.5">
              <span className="grid size-[42px] place-items-center rounded-full border border-[#c4c2b7] text-[18px]" aria-hidden="true">
                {quote.name.charAt(0)}
              </span>
              <div>
                <strong className="block text-sm font-medium">{quote.name}</strong>
                <span className="mt-1 block text-[11px] text-[#727266]">{quote.role}</span>
              </div>
            </div>
          </div>
          <div className={cn("mt-[35px] flex items-center justify-between border-t pt-[25px]", LINE)}>
            <span className={cn(MONO_SMALL, "text-[11px]")}>
              {String(current + 1).padStart(2, "0")}{" "}
              <span className={MUTED}>/ {String(TESTIMONIALS.length).padStart(2, "0")}</span>
            </span>
            <div className="flex gap-2">
              <button
                aria-label="Previous testimonial"
                className={navButton}
                {...navHover}
                onClick={() => setCurrent((current + TESTIMONIALS.length - 1) % TESTIMONIALS.length)}
              >
                <ArrowLeftIcon size={22} />
              </button>
              <button
                aria-label="Next testimonial"
                className={navButton}
                {...navHover}
                onClick={() => setCurrent((current + 1) % TESTIMONIALS.length)}
              >
                <ArrowRightIcon size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
