import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  CalendarCheckIcon,
  ChartBarIcon,
  ChatCircleDotsIcon,
  CertificateIcon,
  ChartLineUpIcon,
  CheckIcon,
  CursorClickIcon,
  HandshakeIcon,
  MagnifyingGlassIcon,
  SealCheckIcon,
  StackIcon,
  TargetIcon,
} from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";
import { AnimatedText } from "@/components/common/AnimatedText";
import { PillButton } from "@/components/common/PillButton";
import { hoverTo } from "@/hooks/useHoverMotion";
import {
  CERTIFICATIONS,
  LEAD_TO_SALES,
  PRICING,
  REVIEWS,
} from "../constants/homeData";
import { CONTENT_NOTE, SECTION, TITLE } from "./homeStyles";
import { SectionLabel } from "./homeUi";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---------- Lead → Sales journey ---------- */
const L2S_ICONS = [
  MagnifyingGlassIcon,
  CursorClickIcon,
  ChatCircleDotsIcon,
  HandshakeIcon,
];

// These are where each card's centre starts (px from the title's centre) in the bunched-up
// cluster; L2S_CARD below holds each card's final corner.
const L2S_START = [
  [-125, -35], // top-left
  [120, -28], // top-right
  [-107, -3], // bottom-left
  [120, 59], // bottom-right
];

// Resting corners (mirrored: top pair 7.3% in, bottom pair 14.4% in), size, and where its pill
// sits: top-left corner of the upper cards, bottom-right of the lower ones.
const L2S_CARD = [
  {
    card: "z-[1] top-[22px] left-[7.3%] aspect-[2/3]",
    pill: "-top-[22px] -left-[74px]",
  },
  {
    card: "z-[2] top-[22px] right-[7.3%] aspect-[25/39]",
    pill: "-top-[22px] -left-[74px]",
  },
  {
    card: "z-[3] bottom-5 left-[14.4%] w-[calc(var(--l2s-w)*1.6)] aspect-[8/5]",
    pill: "right-0 -bottom-5",
  },
  {
    card: "z-[4] bottom-5 right-[14.4%] aspect-square",
    pill: "-right-[46px] -bottom-5",
  },
];

// Faint frosted squares, top-right
const L2S_DECOR = [
  "-top-[70px] right-[calc(clamp(120px,11vw,190px)*1.27)] w-[clamp(240px,21.5vw,375px)] aspect-[2/1]",
  "-top-[70px] right-[50px]",
  "top-[calc(clamp(120px,11vw,190px)-70px)] right-[calc(clamp(120px,11vw,190px)+50px)]",
  "top-[calc(clamp(120px,11vw,190px)*2-70px)] right-[50px]",
];

// Area below the fixed header; below 1024px it becomes normal flow (title, then a 2x2 grid)
const L2S_SAFE =
  "absolute inset-x-0 top-[var(--l2s-safe-top)] bottom-[var(--l2s-safe-bottom)] max-lg:relative max-lg:top-auto max-lg:bottom-auto";

export const LeadToSalesSection = () => {
  const sectionRef = useRef(null);

  // Desktop: the section pins while the cards fly from the centre out to the corners,
  // uncovering the title.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Cards are positioned inside the card list (the area below the fixed header).
          const panel = sectionRef.current.querySelector("[data-l2s-cards]");
          const cards = gsap.utils.toArray(
            "[data-l2s-card]",
            sectionRef.current,
          );
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=110%",
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
          cards.forEach((card, i) => {
            const [sx, sy] = L2S_START[i % L2S_START.length];
            // Distance from the card's resting corner to its spot in the cluster.
            // offsetLeft/Top ignore transforms, so this stays right after resizes.
            const dx = () =>
              panel.offsetWidth / 2 +
              sx -
              (card.offsetLeft + card.offsetWidth / 2);
            const dy = () =>
              panel.offsetHeight / 2 +
              sy -
              (card.offsetTop + card.offsetHeight / 2);
            tl.fromTo(
              card,
              { x: dx, y: dy },
              { x: 0, y: 0, ease: "power2.inOut", duration: 1 },
              0,
            );
          });
        },
      );
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      className="bg-[#efefef] px-[clamp(8px,0.7vw,14px)] text-[#0b0b0b]"
      id="lead-to-sales"
      aria-labelledby="l2s-heading"
      ref={sectionRef}
    >
      <div
        className={cn(
          "relative isolate h-svh min-h-[680px] overflow-hidden bg-[linear-gradient(180deg,#d2dbe6_0%,#e6e7ea_42%,#f6e7d4_78%,#fbe6c9_100%)]",
          // Space kept clear for the fixed header and bottom edge; card width shrinks on short
          // screens so all four cards always fit
          "[--l2s-safe-bottom:26px] [--l2s-safe-top:106px] [--l2s-w:min(clamp(150px,14.4vw,250px),calc((100vh-230px)/2.56))]",
          "max-lg:h-auto max-lg:min-h-0 max-lg:px-7 max-lg:pt-[90px] max-lg:pb-[70px] max-sm:px-4 max-sm:pt-[70px] max-sm:pb-14",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
        >
          {L2S_DECOR.map((pos) => (
            <span
              key={pos}
              className={cn(
                "absolute aspect-square w-[clamp(120px,11vw,190px)] rounded-[36px] bg-white/22",
                pos,
              )}
            />
          ))}
        </div>

        <div
          className={cn(
            L2S_SAFE,
            "z-[1] grid place-items-center px-6 text-center max-lg:p-0",
          )}
        >
          <h2
            id="l2s-heading"
            className="m-0 max-w-[820px] text-[clamp(44px,min(5.6vw,10vh),100px)] font-semibold leading-[1.04] tracking-[-0.06em]"
          >
            {LEAD_TO_SALES.title}
          </h2>
        </div>

        <ol
          data-l2s-cards
          className={cn(
            L2S_SAFE,
            "pointer-events-none z-[2] m-0 list-none p-0",
            "max-lg:mx-auto max-lg:mt-14 max-lg:grid max-lg:max-w-[640px] max-lg:grid-cols-2 max-lg:gap-x-7 max-lg:gap-y-11 max-sm:gap-x-3.5 max-sm:gap-y-9",
          )}
        >
          {LEAD_TO_SALES.steps.map((step, i) => {
            const Icon = L2S_ICONS[i % L2S_ICONS.length];
            const pos = L2S_CARD[i % L2S_CARD.length];
            return (
              <li
                key={step.title}
                data-l2s-card
                className={cn(
                  "pointer-events-auto absolute w-[var(--l2s-w)] will-change-transform",
                  pos.card,
                  "max-lg:relative max-lg:inset-auto max-lg:aspect-[4/5] max-lg:w-full",
                )}
              >
                <img
                  src={step.image}
                  alt=""
                  loading="lazy"
                  className="block size-full rounded-[26px] object-cover"
                />
                <span
                  className={cn(
                    "absolute inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-black/6 bg-white px-6 py-[13px] text-[clamp(16px,1.25vw,21px)] leading-[1.2] text-[#111] shadow-[0_4px_14px_rgba(0,0,0,0.05)]",
                    pos.pill,
                    "max-lg:top-auto max-lg:right-auto max-lg:-bottom-[18px] max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:px-[18px] max-lg:py-2.5",
                    "max-sm:gap-1.5 max-sm:px-[13px] max-sm:py-2 max-sm:text-sm",
                  )}
                >
                  <Icon size={19} aria-hidden="true" />
                  {step.title}
                </span>
                <span className="sr-only">: {step.text}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

/* ---------- Meta certifications (bento grid) ---------- */
const CERT_ICONS = [
  SealCheckIcon,
  CertificateIcon,
  TargetIcon,
  ChartLineUpIcon,
  StackIcon,
];

// Hover: card goes dark, icon loses its tile and grows
const CertCard = ({ item, index }) => {
  const Icon = CERT_ICONS[index % CERT_ICONS.length];
  return (
    <article
      data-hover=""
      {...hoverTo({
        backgroundColor: "#1b1b1d",
        color: "#ffffff",
        duration: 0.35,
      })}
      className="flex flex-col justify-between rounded-[22px] bg-white p-[30px] text-[#111] max-sm:min-h-[220px] max-sm:p-6"
    >
      <span
        className="grid size-[60px] place-items-center rounded-xl bg-[#f1f4f8] text-[28px]"
        aria-hidden="true"
        {...hoverTo({
          backgroundColor: "rgba(241,244,248,0)",
          fontSize: 50,
          duration: 0.35,
          ease: "power3.out",
        })}
      >
        <Icon weight="light" />
      </span>
      <h3 className="m-0 max-w-[280px] text-[clamp(20px,1.35vw,24px)] font-normal leading-[1.45] tracking-[-0.01em]">
        <span className="sr-only">{item.subtitle}: </span>
        {item.title}
      </h3>
    </article>
  );
};

const CertPhoto = ({ photo, className }) => (
  <figure
    data-hover=""
    className={cn("m-0 overflow-hidden rounded-[22px] bg-white", className)}
  >
    <img
      src={photo.src}
      alt={photo.alt}
      loading="lazy"
      className="block size-full object-cover"
      {...hoverTo({ scale: 1.04, duration: 0.6, ease: "power3.out" })}
    />
  </figure>
);

export const CertificationsSection = () => {
  const [a, b, c, d, e] = CERTIFICATIONS.items;
  const { tall, square } = CERTIFICATIONS.photos;
  return (
    <section
      className={cn(SECTION, "bg-[#f1f4f8] text-[#111]")}
      id="certifications"
      aria-labelledby="certs-heading"
    >
      <SectionLabel>{CERTIFICATIONS.label}</SectionLabel>
      <div id="certs-heading">
        <AnimatedText text={CERTIFICATIONS.title} className={TITLE} />
      </div>
      {/* Row 1: 3 cards + tall photo (spans both rows). Row 2: card, photo, card. */}
      <div
        className="mt-16 grid auto-rows-[clamp(280px,18vw,340px)] grid-cols-4 gap-[13px] max-lg:auto-rows-[260px] max-lg:grid-cols-2 max-sm:auto-rows-auto max-sm:grid-cols-1"
        data-animate="stagger"
      >
        <CertCard item={a} index={0} />
        <CertCard item={b} index={1} />
        <CertCard item={c} index={2} />
        <CertPhoto
          photo={tall}
          className="row-span-2 max-sm:row-auto max-sm:aspect-[4/5]"
        />
        <CertCard item={d} index={3} />
        <CertPhoto photo={square} className="max-sm:aspect-square" />
        <CertCard item={e} index={4} />
      </div>
    </section>
  );
};

/* ---------- Weekly review / monthly meeting / free business review ---------- */
const REVIEW_ICONS = [ChartBarIcon, CalendarCheckIcon, MagnifyingGlassIcon];

export const ReviewsSection = () => (
  <section className={SECTION} id="reviews" aria-labelledby="reviews-heading">
    <SectionLabel>{REVIEWS.label}</SectionLabel>
    <div id="reviews-heading">
      <AnimatedText text={REVIEWS.title} className={TITLE} />
    </div>
    <div
      className="mt-16 grid grid-cols-3 gap-3.5 max-lg:max-w-[560px] max-lg:grid-cols-1"
      data-animate="stagger"
    >
      {REVIEWS.items.map((item, i) => {
        const Icon = REVIEW_ICONS[i % REVIEW_ICONS.length];
        const highlight = Boolean(item.cta);
        return (
          <article
            key={item.title}
            className={cn(
              "flex flex-col gap-3.5 rounded-lg border border-home-line bg-[#faf8f2] p-7",
              highlight && "border-home-accent bg-home-accent",
            )}
          >
            <div className="mb-9 flex items-center justify-between">
              <span className="grid size-[52px] place-items-center rounded-full bg-home-ink text-home-accent">
                <Icon size={26} />
              </span>
              <span className="rounded-full border border-current px-2.5 py-[5px] font-home-mono text-[10px] font-medium uppercase leading-[1.4]">
                {item.tag}
              </span>
            </div>
            <h3 className="text-[clamp(24px,2.2vw,32px)] font-normal tracking-[-0.045em]">
              {item.title}
            </h3>
            <p
              className={cn(
                "text-[15px] leading-[1.6]",
                highlight ? "text-[#2a2a22]" : "text-[#4a4a42]",
              )}
            >
              {item.text}
            </p>
            {item.cta && (
              <PillButton to="/#contact" className="mt-auto self-start">
                {item.cta}
              </PillButton>
            )}
          </article>
        );
      })}
    </div>
  </section>
);

/* ---------- Pricing ---------- */
export const PricingSection = () => (
  <section
    className={cn(SECTION, "tablet:pt-10 lg:pt-10")}
    id="pricing"
    aria-labelledby="pricing-heading"
  >
    <SectionLabel>{PRICING.label}</SectionLabel>
    <div id="pricing-heading">
      <AnimatedText text={PRICING.title} className={TITLE} />
    </div>
    <div
      className="mt-16 grid grid-cols-3 items-stretch gap-3.5 max-lg:max-w-[560px] max-lg:grid-cols-1 max-lg:gap-7"
      data-animate="stagger"
    >
      {PRICING.plans.map((plan) => (
        <article
          key={plan.name}
          className={cn(
            "relative flex flex-col rounded-lg border border-home-line bg-[#faf8f2] px-7 pt-8 pb-7",
            plan.popular && "border-home-ink bg-home-ink text-home-paper",
          )}
        >
          {plan.popular && (
            <span className="absolute -top-[13px] left-7 rounded-full bg-home-accent px-[11px] py-1.5 font-home-mono text-[10px] font-medium uppercase leading-none text-[#111]">
              Most popular
            </span>
          )}
          <h3 className="font-home-mono text-xs font-medium uppercase leading-none tracking-[0.04em]">
            {plan.name}
          </h3>
          <p className="mt-3.5 min-h-12 text-[15px] leading-[1.55] opacity-75">
            {plan.description}
          </p>
          <p
            className={cn(
              "my-[26px] flex items-baseline gap-1.5 border-b pb-[26px]",
              plan.popular ? "border-white/15" : "border-home-line",
            )}
          >
            <strong className="text-[clamp(40px,3.6vw,56px)] font-normal leading-none tracking-[-0.06em]">
              {plan.price}
            </strong>
            <span className="text-sm opacity-60">{plan.period}</span>
          </p>
          <ul className="mt-0 mb-8 flex list-none flex-col gap-3 p-0">
            {plan.features.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-sm leading-[1.45]">
                <CheckIcon
                  size={17}
                  weight="bold"
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 shrink-0",
                    plan.popular ? "text-home-accent" : "text-[#b88a00]",
                  )}
                />
                {feature}
              </li>
            ))}
          </ul>
          <PillButton to="/#contact" className="mt-auto">
            {plan.cta}
          </PillButton>
        </article>
      ))}
    </div>
    <p className={CONTENT_NOTE}>{PRICING.note}</p>
  </section>
);
