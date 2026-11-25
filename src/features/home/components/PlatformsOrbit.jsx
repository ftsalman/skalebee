import { Link } from "react-router-dom";
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
import { PLATFORMS, PLATFORMS_SECTION } from "../constants/homeData";

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
    <span className="home-orbit-badge" title={platform.name}>
      <span className="home-orbit-badge-inner" style={{ color: platform.color }}>
        {platform.image ? (
          <img src={platform.image} alt="" />
        ) : Logo ? (
          <Logo weight="fill" />
        ) : (
          <span className="home-orbit-badge-text">{platform.text}</span>
        )}
      </span>
    </span>
  );
};

export const PlatformsOrbit = () => (
  <section className="home-orbit" id="platforms" aria-labelledby="platforms-heading">
    {/* Rotating circle of logos (decorative; the names are listed for screen readers below) */}
    <div className="home-orbit-mask" aria-hidden="true">
      <div className="home-orbit-wheel">
        {SLOTS.map((platform, i) => (
          <span
            key={i}
            className="home-orbit-item"
            style={{ "--angle": `${(360 / SLOTS.length) * i}deg` }}
          >
            <Badge platform={platform} />
          </span>
        ))}
      </div>
    </div>

    <div className="home-orbit-content">
      <p className="home-label" data-animate="fade-up">
        <span aria-hidden="true">[</span> {PLATFORMS_SECTION.label} <span aria-hidden="true">]</span>
      </p>
      <div id="platforms-heading">
        <AnimatedText text={PLATFORMS_SECTION.title} className="home-orbit-title" />
      </div>
      <p className="home-orbit-text" data-animate="fade-up" data-delay="0.15">
        {PLATFORMS_SECTION.description}
      </p>
      <p className="sr-only">Platforms: {PLATFORMS.map((p) => p.name).join(", ")}.</p>
      <div data-animate="fade-up" data-delay="0.3">
        <PillButton to="/#contact" className="home-orbit-cta">{PLATFORMS_SECTION.cta}</PillButton>
      </div>
    </div>
  </section>
);
