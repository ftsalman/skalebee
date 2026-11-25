import { Link } from "react-router-dom";
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
import { Marquee } from "@/components/common/Marquee";
import { META_SPECIALIST } from "../constants/homeData";

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
    <span className="home-meta-tool" title={tool.name}>
      {Icon ? (
        <Icon size={34} aria-hidden="true" />
      ) : (
        <b aria-hidden="true">{tool.text}</b>
      )}
      <span className="sr-only">{tool.name}</span>
    </span>
  );
};

export const MetaSpecialistSection = () => {
  const { label, stats, location, person, partner, toolbox } = META_SPECIALIST;
  return (
    <section
      className="home-section home-meta"
      id="meta-specialist"
      aria-labelledby="meta-heading"
    >
      <p className="home-label home-label-light">
        <span aria-hidden="true">[</span> {label}{" "}
        <span aria-hidden="true">]</span>
        <ArrowDownIcon size={14} weight="bold" aria-hidden="true" />
      </p>

      {/* Row 1: stats column · Meta mark · location globe */}
      <div className="home-meta-top" data-animate="stagger">
        <div className="home-meta-stats">
          {stats.map((stat) => (
            <div className="home-meta-card home-meta-stat" key={stat.label}>
              <strong>
                <span data-counter={stat.value}>{stat.value}</span>
                {stat.suffix}
              </strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="home-meta-card home-meta-mark" aria-hidden="true">
          <MetaLogoIcon weight="fill" />
        </div>

        <div className="home-meta-card home-meta-location">
          <h3>{location.title}</h3>
          <p className="home-meta-status">
            <span className="home-meta-dot" aria-hidden="true" />
            {location.subtitle}
          </p>
          <img className="home-meta-globe" src="/imgs/home/meta-globe.svg" width="800" height="800" alt="" loading="lazy" decoding="async" />
        </div>
      </div>

      {/* Row 2: specialist profile · partner card */}
      <div className="home-meta-mid" data-animate="fade-up">
        <article className="home-meta-card home-meta-profile">
          <figure className="home-meta-portrait">
            <img
              src={person.image}
              alt={`${person.name}, ${person.role}`}
              loading="lazy"
            />
            <figcaption>
              <strong>{person.name}</strong>
              <span>{person.role}</span>
            </figcaption>
          </figure>
          <div className="home-meta-bio">
            <h2 id="meta-heading">{person.heading}</h2>
            {person.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <AsteriskIcon
              className="home-meta-asterisk"
              size={26}
              weight="bold"
              aria-hidden="true"
            />
            <Link to="/#contact" className="home-meta-link">
              {person.cta} <ArrowRightIcon size={14} aria-hidden="true" />
            </Link>
          </div>
        </article>

        <article className="home-meta-card home-meta-partner">
          <div className="home-meta-partner-mark" aria-hidden="true">
            <SealCheckIcon weight="fill" />
          </div>
          <div>
            <h3>{partner.title}</h3>
            <Link to="/#certifications" className="home-meta-link">
              {partner.cta} <ArrowRightIcon size={14} aria-hidden="true" />
            </Link>
          </div>
        </article>
      </div>

      {/* Row 3: toolbox marquee */}
      <div className="home-meta-card home-meta-toolbox" data-animate="fade-up">
        <div className="home-meta-toolbox-copy">
          <h3>{toolbox.title}</h3>
          <p>{toolbox.subtitle}</p>
        </div>
        <Marquee duration={40} pauseOnHover className="home-meta-marquee">
          {toolbox.tools.map((tool) => (
            <ToolTile key={tool.name} tool={tool} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};
