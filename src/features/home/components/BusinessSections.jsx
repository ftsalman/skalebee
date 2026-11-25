import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowUpRightIcon,
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
import { AnimatedText } from "@/components/common/AnimatedText";
import { PillButton } from "@/components/common/PillButton";
import { CERTIFICATIONS, LEAD_TO_SALES, PRICING, REVIEWS } from "../constants/homeData";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Label = ({ children, light = false }) => (
  <p className={`home-label${light ? " home-label-light" : ""}`}>
    <span aria-hidden="true">[</span> {children} <span aria-hidden="true">]</span>
  </p>
);

/* ---------- Lead → Sales journey ---------- */
const L2S_ICONS = [MagnifyingGlassIcon, CursorClickIcon, ChatCircleDotsIcon, HandshakeIcon];

// Final corner positions live in CSS (.home-l2s-card.is-N). These are where each
// card's centre starts (px from the title's centre) in the bunched-up cluster.
const L2S_START = [
  [-125, -35], // top-left
  [120, -28], // top-right
  [-107, -3], // bottom-left
  [120, 59], // bottom-right
];

export const LeadToSalesSection = () => {
  const sectionRef = useRef(null);

  // Desktop: the section pins while the cards fly from the centre out to the corners,
  // uncovering the title.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        // Cards are positioned inside .home-l2s-cards (the area below the fixed header).
        const panel = sectionRef.current.querySelector(".home-l2s-cards");
        const cards = gsap.utils.toArray(".home-l2s-card", sectionRef.current);
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
          // Distance from the card's resting corner (CSS) to its spot in the cluster.
          // offsetLeft/Top ignore transforms, so this stays right after resizes.
          const dx = () => panel.offsetWidth / 2 + sx - (card.offsetLeft + card.offsetWidth / 2);
          const dy = () => panel.offsetHeight / 2 + sy - (card.offsetTop + card.offsetHeight / 2);
          tl.fromTo(card, { x: dx, y: dy }, { x: 0, y: 0, ease: "power2.inOut", duration: 1 }, 0);
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section className="home-l2s" id="lead-to-sales" aria-labelledby="l2s-heading" ref={sectionRef}>
      <div className="home-l2s-panel">
        <div className="home-l2s-decor" aria-hidden="true">
          <span /><span /><span /><span />
        </div>

        <div className="home-l2s-copy">
          <h2 id="l2s-heading" className="home-l2s-title">{LEAD_TO_SALES.title}</h2>
        </div>

        <ol className="home-l2s-cards">
          {LEAD_TO_SALES.steps.map((step, i) => {
            const Icon = L2S_ICONS[i % L2S_ICONS.length];
            return (
              <li key={step.title} className={`home-l2s-card is-${i}`}>
                <img src={step.image} alt="" loading="lazy" />
                <span className="home-l2s-pill">
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
const CERT_ICONS = [SealCheckIcon, CertificateIcon, TargetIcon, ChartLineUpIcon, StackIcon];

const CertCard = ({ item, index }) => {
  const Icon = CERT_ICONS[index % CERT_ICONS.length];
  return (
    <article className="home-cert">
      <span className="home-cert-icon" aria-hidden="true">
        <Icon weight="light" />
      </span>
      <h3>
        <span className="sr-only">{item.subtitle}: </span>
        {item.title}
      </h3>
    </article>
  );
};

const CertPhoto = ({ photo, className }) => (
  <figure className={`home-cert-photo ${className}`}>
    <img src={photo.src} alt={photo.alt} loading="lazy" />
  </figure>
);

export const CertificationsSection = () => {
  const [a, b, c, d, e] = CERTIFICATIONS.items;
  const { tall, square } = CERTIFICATIONS.photos;
  return (
    <section className="home-section home-certs" id="certifications" aria-labelledby="certs-heading">
      <Label>{CERTIFICATIONS.label}</Label>
      <div id="certs-heading">
        <AnimatedText text={CERTIFICATIONS.title} className="home-title" />
      </div>
      {/* Row 1: 3 cards + tall photo (spans both rows). Row 2: card, photo, card. */}
      <div className="home-cert-grid" data-animate="stagger">
        <CertCard item={a} index={0} />
        <CertCard item={b} index={1} />
        <CertCard item={c} index={2} />
        <CertPhoto photo={tall} className="is-tall" />
        <CertCard item={d} index={3} />
        <CertPhoto photo={square} className="is-square" />
        <CertCard item={e} index={4} />
      </div>
    </section>
  );
};

/* ---------- Weekly review / monthly meeting / free business review ---------- */
const REVIEW_ICONS = [ChartBarIcon, CalendarCheckIcon, MagnifyingGlassIcon];

export const ReviewsSection = () => (
  <section className="home-section home-reviews" id="reviews" aria-labelledby="reviews-heading">
    <Label>{REVIEWS.label}</Label>
    <div id="reviews-heading">
      <AnimatedText text={REVIEWS.title} className="home-title" />
    </div>
    <div className="home-review-grid" data-animate="stagger">
      {REVIEWS.items.map((item, i) => {
        const Icon = REVIEW_ICONS[i % REVIEW_ICONS.length];
        return (
          <article key={item.title} className={`home-review${item.cta ? " is-highlight" : ""}`}>
            <div className="home-review-top">
              <span className="home-review-icon"><Icon size={26} /></span>
              <span className="home-review-tag">{item.tag}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            {item.cta && (
              <PillButton to="/#contact">{item.cta}</PillButton>
            )}
          </article>
        );
      })}
    </div>
  </section>
);

/* ---------- Pricing ---------- */
export const PricingSection = () => (
  <section className="home-section home-pricing" id="pricing" aria-labelledby="pricing-heading">
    <Label>{PRICING.label}</Label>
    <div id="pricing-heading">
      <AnimatedText text={PRICING.title} className="home-title" />
    </div>
    <div className="home-plan-grid" data-animate="stagger">
      {PRICING.plans.map((plan) => (
        <article key={plan.name} className={`home-plan${plan.popular ? " is-popular" : ""}`}>
          {plan.popular && <span className="home-plan-badge">Most popular</span>}
          <h3>{plan.name}</h3>
          <p className="home-plan-desc">{plan.description}</p>
          <p className="home-plan-price">
            <strong>{plan.price}</strong>
            <span>{plan.period}</span>
          </p>
          <ul>
            {plan.features.map((feature) => (
              <li key={feature}><CheckIcon size={17} weight="bold" aria-hidden="true" />{feature}</li>
            ))}
          </ul>
          <PillButton to="/#contact" className="home-plan-cta">{plan.cta}</PillButton>
        </article>
      ))}
    </div>
    <p className="home-content-note">{PRICING.note}</p>
  </section>
);
