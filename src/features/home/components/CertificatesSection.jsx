import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";
import { AnimatedText } from "@/components/common/AnimatedText";
import { hoverTo } from "@/hooks/useHoverMotion";
import { CERTIFICATES } from "../constants/homeData";
import { LABEL, SECTION } from "./homeStyles";

function moveDotHighlight(event) {
  if (event.pointerType !== "mouse") return;
  const section = event.currentTarget;
  const { left, top } = section.getBoundingClientRect();
  section.style.setProperty("--dot-position", `${event.clientX - left}px ${event.clientY - top}px`);
  section.dataset.dotHover = "";
}

function hideDotHighlight(event) {
  delete event.currentTarget.dataset.dotHover;
}

export const CertificatesSection = () => {
  const { label, title, description, badges } = CERTIFICATES;
  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      onPointerEnter={moveDotHighlight}
      onPointerMove={moveDotHighlight}
      onPointerLeave={hideDotHighlight}
      onPointerCancel={hideDotHighlight}
      className={cn(SECTION, "relative isolate overflow-hidden bg-white bg-[url(/imgs/home/certifications-halftone.webp)] bg-size-[max(100%,1100px)_auto] bg-top bg-repeat-y text-home-ink")}
    >
      <div className="relative grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-x-16 gap-y-14 max-lg:grid-cols-1">
        <div className="max-w-[560px]">
          <p className={cn(LABEL, "m-0 text-[13px] text-home-muted max-tablet:text-[12px]")}>
            <span aria-hidden="true">[</span> {label} <span aria-hidden="true">]</span>
          </p>
          <AnimatedText
            as="h2"
            id="certifications-heading"
            className="mt-6 mb-0 text-balance text-[clamp(34px,3.6vw,58px)] font-normal leading-[1.05] tracking-[-0.055em]"
          >
            {title}
          </AnimatedText>
          <AnimatedText as="p" className="mt-6 mb-0 max-w-[46ch] text-[clamp(16px,1.15vw,19px)] leading-[1.55] tracking-[-0.015em] text-home-muted">
            {description}
          </AnimatedText>
        </div>

        <ul className="m-0 grid w-full max-w-[600px] list-none grid-cols-2 items-start gap-x-[clamp(14px,3vw,48px)] p-0 max-lg:mx-auto">
          {badges.map((badge) => (
            <li key={badge.name}>
              <a
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${badge.alt}: verify on Credly (opens in a new tab)`}
                data-hover=""
                className="group flex flex-col items-center rounded-3xl text-center focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-bee-yellow"
              >
                <img
                  src={badge.src}
                  alt=""
                  width={badge.width}
                  height={badge.height}
                  loading="lazy"
                  decoding="async"
                  className="h-[clamp(124px,13.5vw,220px)] w-auto drop-shadow-[0_18px_26px_rgba(120,96,20,0.16)]"
                  {...hoverTo({ y: -6, rotate: -2, scale: 1.03, duration: 0.45, ease: "power3.out" })}
                />
                <span className="mt-5 text-balance text-[clamp(15px,1.1vw,18px)] leading-[1.3] tracking-[-0.02em]">{badge.name}</span>
                <span className="mt-1.5 inline-flex flex-wrap items-center justify-center gap-x-1 font-home-mono text-[11px] uppercase tablet:text-[12px] leading-[1.5] tracking-[0.03em] text-home-muted">
                  {badge.issuer}
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    · Credly
                    <ArrowUpRightIcon size={12} aria-hidden="true" {...hoverTo({ x: 2, y: -2, duration: 0.25 })} />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
