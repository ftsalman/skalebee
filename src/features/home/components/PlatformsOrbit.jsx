import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRightIcon,
  FacebookLogoIcon,
  GoogleLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  MetaLogoIcon,
  ThreadsLogoIcon,
  TiktokLogoIcon,
  WhatsappLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { PillButton } from "@/components/common/PillButton";
import { AnimatedText } from "@/components/common/AnimatedText";
import { cn } from "@turtle-ui/utils";
import { PLATFORMS, PLATFORMS_SECTION } from "../constants/homeData";
import { LABEL, SECTION_X } from "./homeStyles";

gsap.registerPlugin(useGSAP);
const TURN = 120; // seconds for one full turn

const LOGOS = {
  MetaLogo: MetaLogoIcon,
  FacebookLogo: FacebookLogoIcon,
  InstagramLogo: InstagramLogoIcon,
  WhatsappLogo: WhatsappLogoIcon,
  GoogleLogo: GoogleLogoIcon,
  YoutubeLogo: YoutubeLogoIcon,
  LinkedinLogo: LinkedinLogoIcon,
  ThreadsLogo: ThreadsLogoIcon,
  TiktokLogo: TiktokLogoIcon,
};

// Repeat the logos so the whole circle is filled (about one logo every 11°)
const MIN_SLOTS = 32;
const SLOTS = Array.from(
  { length: Math.ceil(MIN_SLOTS / PLATFORMS.length) * PLATFORMS.length },
  (_, i) => PLATFORMS[i % PLATFORMS.length],
);

const Badge = ({ platform }) => {
  const Logo = LOGOS[platform.icon];
  return (
    <span
      data-orbit-badge
      // Centred on its slot; `rotate` undoes the slot angle, GSAP undoes the wheel spin
      className="absolute grid size-[var(--orbit-badge)] -translate-x-1/2 -translate-y-1/2 rotate-[calc(var(--angle)*-1)] place-items-center rounded-full bg-[#1b1b19] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.45)]"
      title={platform.name}
    >
      <span
        className="grid size-[56%] place-items-center overflow-hidden rounded-full bg-white [&_img]:size-full [&_img]:object-cover [&_svg]:size-[72%]"
        style={{ color: platform.color }}
      >
        {platform.image ? (
          <img src={platform.image} alt="" />
        ) : Logo ? (
          <Logo weight="fill" />
        ) : (
          <span className="font-sans text-[clamp(9px,0.75vw,13px)] font-extrabold leading-none tracking-[-0.03em]">{platform.text}</span>
        )}
      </span>
    </span>
  );
};

export const PlatformsOrbit = () => {
  const sectionRef = useRef(null);
  const spinRef = useRef(null);

  // The wheel turns; each badge turns back the same amount so the logos stay upright.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(sectionRef);
      spinRef.current = gsap
        .timeline({ repeat: -1, defaults: { duration: TURN, ease: "none" } })
        .to(q("[data-orbit-wheel]"), { rotation: 360 }, 0)
        .to(q("[data-orbit-badge]"), { rotation: -360 }, 0);
      return () => { spinRef.current = null; };
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  // Hovering the section eases the spin to a stop
  const setSpeed = (timeScale) => {
    if (spinRef.current) gsap.to(spinRef.current, { timeScale, duration: 0.6, ease: "power2.out", overwrite: true });
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        SECTION_X,
        "relative min-h-[clamp(700px,52vw,800px)] overflow-hidden pt-[62px] text-center tablet:pt-20 lg:pt-[110px] max-sm:min-h-[760px]",
        "[--orbit-badge:clamp(46px,3.5vw,66px)] [--orbit-r:clamp(360px,46vw,886px)]",
      )}
      id="platforms"
      aria-labelledby="platforms-heading"
      onPointerEnter={() => setSpeed(0)}
      onPointerLeave={() => setSpeed(1)}
    >
      {/* Rotating circle of logos (decorative; the names are listed for screen readers below).
          The mask fades the logos out towards the top ends of the arc. */}
      <div
        className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_28%,#000_58%)] max-sm:[mask-image:linear-gradient(to_bottom,transparent_45%,#000_70%)]"
        aria-hidden="true"
      >
        <div
          data-orbit-wheel
          className="absolute bottom-[clamp(80px,8vw,124px)] left-1/2 ml-[calc(var(--orbit-r)*-1)] size-[calc(var(--orbit-r)*2)] rounded-full border-2 border-home-line max-sm:bottom-[70px]"
        >
          {SLOTS.map((platform, i) => (
            <span
              key={i}
              className="absolute top-1/2 left-1/2 [transform:rotate(var(--angle))_translateY(var(--orbit-r))]"
              style={{ "--angle": `${(360 / SLOTS.length) * i}deg` }}
            >
              <Badge platform={platform} />
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-[1] mx-auto flex max-w-[820px] flex-col items-center">
        <p className={cn(LABEL, "justify-center")} data-animate="fade-up">
          <span aria-hidden="true">[</span> {PLATFORMS_SECTION.label} <span aria-hidden="true">]</span>
        </p>
        <div id="platforms-heading">
          <AnimatedText
            text={PLATFORMS_SECTION.title}
            className="mt-[22px] mb-0 text-[clamp(38px,4.4vw,68px)] font-normal leading-[1.12] tracking-[-0.045em]"
          />
        </div>
        <AnimatedText as="p"
          className="mt-[22px] max-w-[660px] text-[clamp(16px,1.2vw,21px)] leading-normal text-[#3a3a34]"
        >
          {PLATFORMS_SECTION.description}
        </AnimatedText>
        <p className="sr-only">Platforms: {PLATFORMS.map((p) => p.name).join(", ")}.</p>
        <div data-animate="fade-up" data-delay="0.3">
          <PillButton to="/#contact" className="mt-[46px]">{PLATFORMS_SECTION.cta}</PillButton>
        </div>
      </div>
    </section>
  );
};
