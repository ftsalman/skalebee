import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  AsteriskIcon,
  FacebookLogoIcon,
  FigmaLogoIcon,
  GoogleLogoIcon,
  InstagramLogoIcon,
  MessengerLogoIcon,
  MetaLogoIcon,
  SealCheckIcon,
  ThreadsLogoIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";
import { Marquee } from "@/components/common/Marquee";
import { hoverTo } from "@/hooks/useHoverMotion";
import { META_SPECIALIST } from "../constants/homeData";
import { LABEL, SECTION } from "./homeStyles";

gsap.registerPlugin(useGSAP);

// Dark bento palette
const CARD = "rounded-[14px] border border-[#262626] bg-[#0e0e0e]";
const MUTED = "text-[#a3a3a3]";
const META_BLUE = "#0866ff";
const LINK = cn("inline-flex items-center gap-2 text-[15px]", MUTED);
const LINK_HOVER = { "data-hover": "", ...hoverTo({ color: "#ffffff", gap: 12, duration: 0.25 }) };

const LOGOS = {
  MetaLogo: MetaLogoIcon,
  FacebookLogo: FacebookLogoIcon,
  InstagramLogo: InstagramLogoIcon,
  WhatsappLogo: WhatsappLogoIcon,
  MessengerLogo: MessengerLogoIcon,
  ThreadsLogo: ThreadsLogoIcon,
  GoogleLogo: GoogleLogoIcon,
  FigmaLogo: FigmaLogoIcon,
};

const ToolTile = ({ tool }) => {
  const Icon = tool.icon && LOGOS[tool.icon];
  return (
    <span
      className="mr-[13px] grid size-[88px] place-items-center rounded-xl border border-[#262626] bg-[#111] text-[#e6e6e6] max-sm:size-[72px]"
      title={tool.name}
      data-hover=""
      {...hoverTo({ borderColor: META_BLUE, color: "#ffffff", duration: 0.25 })}
    >
      {Icon ? (
        <Icon size={34} aria-hidden="true" />
      ) : (
        <b className="text-[20px] font-bold leading-none tracking-[-0.04em]" aria-hidden="true">
          {tool.text}
        </b>
      )}
      <span className="sr-only">{tool.name}</span>
    </span>
  );
};

export const MetaSpecialistSection = () => {
  const { label, stats, location, person, partner, toolbox } = META_SPECIALIST;
  const sectionRef = useRef(null);

  // Live dot pulses; the globe sways gently side to side
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(sectionRef);
        gsap.to(q("[data-meta-dot]"), {
          keyframes: {
            "0%": { boxShadow: "0 0 0 0px rgba(54,224,59,0.5)" },
            "70%": { boxShadow: "0 0 0 10px rgba(54,224,59,0)" },
            "100%": { boxShadow: "0 0 0 0px rgba(54,224,59,0)" },
            easeEach: "power1.out",
          },
          duration: 2,
          repeat: -1,
        });
        gsap.fromTo(
          q("[data-meta-globe]"),
          { rotation: -5 },
          { rotation: 5, duration: 18, ease: "sine.inOut", repeat: -1, yoyo: true },
        );
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={cn(SECTION, "bg-[#0b0b0b] text-[#f5f5f5]")}
      id="meta-specialist"
      aria-labelledby="meta-heading"
    >
      <p className={cn(LABEL, "text-[13px] text-[#bdbdb3] max-tablet:text-[13px]")}>
        <span aria-hidden="true">[</span> {label} <span aria-hidden="true">]</span>
        <ArrowDownIcon size={14} weight="bold" aria-hidden="true" />
      </p>

      {/* Row 1: stats column · Meta mark · location globe */}
      <div
        className="mt-14 grid grid-cols-[minmax(180px,0.55fr)_minmax(0,1.15fr)_minmax(0,2fr)] gap-[13px] max-lg:grid-cols-2 max-sm:grid-cols-1"
        data-animate="stagger"
      >
        <div className="grid grid-rows-3 gap-[13px] max-lg:col-span-full max-lg:grid-cols-3 max-lg:grid-rows-none max-sm:grid-cols-1">
          {stats.map((stat) => (
            <div
              className={cn(CARD, "flex min-h-[170px] flex-col items-center justify-center gap-2 px-4 py-6 text-center max-sm:min-h-[140px]")}
              key={stat.label}
            >
              <strong className="text-[clamp(40px,3.4vw,56px)] font-medium leading-none tracking-[-0.06em]">
                <span data-counter={stat.value}>{stat.value}</span>
                {stat.suffix}
              </strong>
              <span className={cn("text-sm", MUTED)}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Brushed-metal Meta mark; turns Meta blue and tilts on hover */}
        <div
          className={cn(CARD, "grid place-items-center overflow-hidden text-[clamp(140px,14vw,240px)] text-[#2b2b2b] max-sm:min-h-[300px]")}
          aria-hidden="true"
          data-hover=""
        >
          <MetaLogoIcon
            weight="fill"
            className="text-[#3a3a3a] [filter:drop-shadow(0_22px_28px_#000)_drop-shadow(0_-1px_0_#8a8a8a)_drop-shadow(0_1px_0_#1a1a1a)]"
            {...hoverTo({ color: META_BLUE, rotate: -6, scale: 1.05, duration: 0.8, ease: "power3.out" })}
          />
        </div>

        <div
          className={cn(
            CARD,
            "relative flex min-h-[540px] flex-col items-center overflow-hidden pt-16 text-center max-lg:min-h-[460px] max-sm:min-h-[400px] max-sm:pt-11",
          )}
        >
          <h3 className="m-0 text-[clamp(24px,2vw,32px)] font-normal tracking-[-0.05em]">{location.title}</h3>
          <p className="mt-2 flex items-center gap-3 font-home-mono text-[clamp(14px,1.2vw,19px)] font-medium uppercase leading-[1.4] text-[#cfcfcf] max-sm:text-[13px]">
            <span data-meta-dot className="size-3 rounded-full bg-[#36e03b] shadow-[0_0_0_0_rgba(54,224,59,0.5)]" aria-hidden="true" />
            {location.subtitle}
          </p>
          <img
            data-meta-globe
            className="absolute top-[180px] left-1/2 aspect-square w-[min(108%,1000px)] max-w-none -translate-x-1/2 max-sm:top-[140px] max-sm:w-[130%]"
            src="/imgs/home/meta-globe.svg"
            width="800"
            height="800"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {/* Row 2: specialist profile · partner card */}
      <div className="mt-[13px] grid grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)] gap-[13px] max-lg:grid-cols-1" data-animate="fade-up">
        <article className={cn(CARD, "grid grid-cols-[minmax(240px,0.75fr)_minmax(0,1.25fr)] gap-10 p-[18px] max-lg:grid-cols-1")}>
          <figure className="relative m-0 min-h-[520px] overflow-hidden rounded bg-[linear-gradient(160deg,#ff8a3d,#e2541b)] max-lg:min-h-[460px]">
            <img
              src={person.image}
              alt={`${person.name}, ${person.role}`}
              loading="lazy"
              className="absolute inset-0 size-full object-cover object-top mix-blend-multiply contrast-[1.1] grayscale"
            />
            <figcaption className="absolute inset-x-5 bottom-5 flex flex-col gap-1.5">
              <strong className="text-[clamp(24px,2vw,30px)] font-normal tracking-[-0.04em]">{person.name}</strong>
              <span className="font-home-mono text-[13px] font-medium uppercase leading-[1.4] text-[#f2f2f2]">{person.role}</span>
            </figcaption>
          </figure>
          <div className="flex max-w-[640px] flex-col pt-[18px] pr-6 pb-2 max-lg:px-2 max-lg:pt-2 max-lg:pb-3">
            <h2 id="meta-heading" className="mt-0 mb-8 text-[clamp(26px,2.1vw,32px)] font-normal tracking-[-0.04em]">
              {person.heading}
            </h2>
            {person.bio.map((p) => (
              <p key={p} className="mt-0 mb-[22px] text-base leading-[1.55] tracking-[-0.02em] text-[#e9e9e9]">
                {p}
              </p>
            ))}
            <AsteriskIcon className="mt-[18px] mb-auto" size={26} weight="bold" aria-hidden="true" />
            <Link to="/#contact" className={cn(LINK, "mt-7")} {...LINK_HOVER}>
              {person.cta} <ArrowRightIcon size={14} aria-hidden="true" />
            </Link>
          </div>
        </article>

        <article className={cn(CARD, "flex flex-col justify-between p-9 max-lg:min-h-[340px]")} data-hover="">
          <div className="grid flex-1 place-items-center text-[clamp(120px,11vw,200px)] text-[#2e2e2e]" aria-hidden="true">
            <SealCheckIcon
              weight="fill"
              className="[filter:drop-shadow(0_20px_26px_#000)_drop-shadow(0_-1px_0_#9a9a9a)]"
              {...hoverTo({ color: META_BLUE, rotate: 8, duration: 0.8, ease: "power3.out" })}
            />
          </div>
          <div>
            <h3 className="m-0 text-base font-medium">{partner.title}</h3>
            <Link to="/#certifications" className={cn(LINK, "mt-1")} {...LINK_HOVER}>
              {partner.cta} <ArrowRightIcon size={14} aria-hidden="true" />
            </Link>
          </div>
        </article>
      </div>

      {/* Row 3: toolbox marquee */}
      <div
        className={cn(
          CARD,
          "mt-[13px] grid grid-cols-[minmax(200px,0.22fr)_minmax(0,1fr)] items-center gap-8 overflow-hidden py-[46px] pl-9 max-sm:grid-cols-1 max-sm:py-[30px] max-sm:pl-6",
        )}
        data-animate="fade-up"
      >
        <div>
          <h3 className="m-0 text-base font-medium">{toolbox.title}</h3>
          <p className={cn("mt-1 mb-0 text-[15px]", MUTED)}>{toolbox.subtitle}</p>
        </div>
        <Marquee duration={40} pauseOnHover className="[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          {toolbox.tools.map((tool) => (
            <ToolTile key={tool.name} tool={tool} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};
