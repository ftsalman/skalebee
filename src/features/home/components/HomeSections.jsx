import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRightIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { AnimatedText } from "@/components/common/AnimatedText";
import { PillButton } from "@/components/common/PillButton";
import { Marquee } from "@/components/common/Marquee";
import { CONTACT_INFO } from "@/constants/constants";
import {
  APPROACH,
  CASE_STUDIES,
  FAQS,
  SERVICES,
  STATS,
  TESTIMONIALS,
  WHY_US,
} from "../constants/homeData";

const SectionLabel = ({ children, light = false }) => (
  <p className={`home-label${light ? " home-label-light" : ""}`}>
    <span aria-hidden="true">[</span> {children}{" "}
    <span aria-hidden="true">]</span>
  </p>
);

const SectionTitle = ({ children, className = "" }) => (
  <AnimatedText text={children} className={`home-title ${className}`} />
);

export const BrandStrip = () => (
  <section className="home-brand-strip" aria-label="Brands we work with">
    <SectionLabel>Brands we work with</SectionLabel>
    <Marquee duration={32} pauseOnHover className="home-brand-marquee">
      {/* Repeated so the strip is always full */}
      {[...CASE_STUDIES, ...CASE_STUDIES, ...CASE_STUDIES].map(({ client }, i) => (
        <span className="home-brand-word" key={`${client}-${i}`}>
          {client}
          <img src="/svgs/icon.svg" width="28" height="28" alt="" />
        </span>
      ))}
    </Marquee>
  </section>
);

// Card visual: a screenshot if the brand has one (`image`), otherwise its logo on a coloured card
const ProjectVisual = ({ project }) =>
  project.image ? (
    <img src={project.image} alt={`${project.client} project`} loading="lazy" width="1400" height="1050" />
  ) : (
    <span className={`home-project-logo is-${project.theme || "dark"}`}>
      {project.logo ? <img src={project.logo} alt={`${project.client} logo`} loading="lazy" /> : <b>{project.client}</b>}
    </span>
  );

const ProjectDialog = ({ index, onClose }) => {
  const dialogRef = useRef(null);
  const project = CASE_STUDIES[index];
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
      className="home-project-dialog"
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
        className="home-dialog-close"
        aria-label="Close project"
        onClick={onClose}
        autoFocus
      >
        <XIcon size={24} />
      </button>
      <div className="home-dialog-image home-dialog-visual">
        <ProjectVisual project={project} />
      </div>
      <div className="home-dialog-content">
        <SectionLabel>Client</SectionLabel>
        <h2 id="project-dialog-title">{project.client}</h2>
        <p>{project.category}</p>
        {project.note && <p className="home-muted">{project.note}</p>}
        <PillButton to="/#contact" onClick={onClose}>
          Discuss a similar project
        </PillButton>
      </div>
    </dialog>
  );
};

// Moves the "See project" label to the mouse position inside a project image
const followCursor = (event) => {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--cursor-x",
    `${event.clientX - box.left}px`,
  );
  event.currentTarget.style.setProperty(
    "--cursor-y",
    `${event.clientY - box.top}px`,
  );
};

export const FeaturedWork = () => {
  const [selected, setSelected] = useState(null);
  return (
    <section
      className="home-section home-work"
      id="work"
      aria-labelledby="work-heading"
    >
      <SectionLabel>Selected work</SectionLabel>
      <div className="home-section-heading">
        <div id="work-heading">
          <SectionTitle>Brands we’ve helped grow.</SectionTitle>
        </div>
        <Link to="/#contact" className="home-text-link">
          Start a project <ArrowUpRightIcon size={21} />
        </Link>
      </div>
      <div className="home-work-track">
        <div className="home-work-stage">
          {CASE_STUDIES.map((project, index) => (
            <article key={project.client} className="home-project">
              <button
                className="home-project-button"
                onClick={() => setSelected(index)}
                aria-label={`About our work with ${project.client}`}
              >
                <div
                  className="home-project-visual"
                  onPointerEnter={followCursor}
                  onPointerMove={followCursor}
                >
                  <ProjectVisual project={project} />
                  <span className="home-project-cursor" aria-hidden="true">
                    See project <ArrowRightIcon size={15} weight="bold" />
                  </span>
                  <span className="home-project-number">
                    0{index + 1} / {project.category}
                  </span>
                  {project.result && (
                    <span className="home-project-result">
                      <strong>{project.result}</strong>
                      <span>{project.resultLabel}</span>
                    </span>
                  )}
                  <span className="home-project-arrow">
                    <ArrowUpRightIcon size={27} />
                  </span>
                </div>
                <div className="home-project-caption">
                  <h3>{project.client}</h3>
                  <span>{project.category}</span>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>
      {selected !== null && (
        <ProjectDialog index={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
};

export const AboutSection = () => (
  <section
    className="home-section home-about"
    id="about"
    aria-labelledby="about-heading"
  >
    <SectionLabel>About Skalebee</SectionLabel>
    <div className="home-about-heading" id="about-heading">
      <SectionTitle>A Meta-certified team for the UAE and India.</SectionTitle>
      <p>{WHY_US.description}</p>
    </div>
    <div className="home-stats" data-animate="stagger">
      {STATS.map((stat) => (
        <div className="home-stat" key={stat.label}>
          <strong>
            <span data-counter={stat.value} data-decimals={stat.decimals || 0}>
              {stat.value}
            </span>
            {stat.suffix}
          </strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
    <div className="home-about-grid">
      <div className="home-portrait" data-home-parallax-frame>
        <img
          src="/imgs/brand/shakkeer.webp"
          alt="Hand-drawn portrait of Shakkeer, founder of Skalebee"
          width="760"
          height="971"
          loading="lazy"
          data-home-parallax
        />
        <div className="home-portrait-caption">
          <span>Hi, I’m Shakkeer. Meta certified.</span>
          <img src="/svgs/icon.svg" alt="" width="32" height="32" />
        </div>
      </div>
      <div className="home-about-copy" data-animate="fade-up">
        <SectionLabel>{WHY_US.eyebrow}</SectionLabel>
        <h3>{WHY_US.title}</h3>
        <p>
          Skalebee helps businesses get more customers online, and actually
          close them. We are a brand of Sharaco Technologies Pvt Ltd, based in
          Pattambi, Kerala, and working with businesses in Dubai, across the UAE
          and throughout India.
        </p>
        <p>
          Sales over vanity: likes and clicks are nice, but leads, bookings and
          revenue are what we report on. You own your ad accounts and data, and
          our fee and your ad budget are always shown separately.
        </p>
        <ul>
          {WHY_US.points.map((point) => (
            <li key={point}>
              <CheckIcon size={18} aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
        <PillButton to="/#contact">Get a free growth audit</PillButton>
      </div>
    </div>
    <div className="home-platforms">
      <SectionLabel>Where we make it happen</SectionLabel>
      <div>
        {["Google", "Meta", "Instagram", "Facebook", "WhatsApp"].map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>
    </div>
  </section>
);

export const ProcessSection = () => (
  <section
    className="home-section home-process"
    id="process"
    aria-labelledby="process-heading"
  >
    <div className="home-process-intro">
      <SectionLabel>How it works</SectionLabel>
      <div id="process-heading">
        <SectionTitle>Your growth journey in 8 simple steps.</SectionTitle>
      </div>
      <p>
        Every Skalebee plan follows the same path: get seen, get chosen, reply
        fast, close the sale and keep improving.
      </p>
      <span className="home-process-scroll">
        Keep moving <ArrowRightIcon size={18} />
      </span>
    </div>
    <div className="home-process-steps">
      {APPROACH.map((step, index) => (
        <article className="home-process-step" key={step.title} data-home-step>
          <span className="home-step-number">0{index + 1}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
          <ArrowUpRightIcon size={32} aria-hidden="true" />
        </article>
      ))}
    </div>
  </section>
);

export const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  // Only real testimonials: the section stays hidden until TESTIMONIALS has entries
  if (!TESTIMONIALS.length) return null;
  const quote = TESTIMONIALS[current];
  return (
    <section
      className="home-section home-testimonials"
      aria-labelledby="testimonials-heading"
    >
      <SectionLabel>Good words</SectionLabel>
      <div className="home-section-heading">
        <div id="testimonials-heading">
          <SectionTitle>Better together. In their words.</SectionTitle>
        </div>
      </div>
      <div className="home-testimonial-layout">
        <div className="home-testimonial-brand" aria-hidden="true">
          <img src="/svgs/logo-stacked.svg" alt="" width="250" height="250" />
          <span>Made of good partnerships.</span>
        </div>
        <div className="home-quote-panel">
          <div
            aria-live="polite"
            aria-atomic="true"
            className="home-quote-content"
            key={current}
          >
            <blockquote>“{quote.quote}”</blockquote>
            <div className="home-quote-person">
              <span className="home-avatar" aria-hidden="true">
                {quote.name.charAt(0)}
              </span>
              <div>
                <strong>{quote.name}</strong>
                <span>{quote.role}</span>
              </div>
            </div>
          </div>
          <div className="home-quote-controls">
            <span>
              {String(current + 1).padStart(2, "0")}{" "}
              <span className="home-muted">
                / {String(TESTIMONIALS.length).padStart(2, "0")}
              </span>
            </span>
            <div>
              <button
                aria-label="Previous testimonial"
                onClick={() =>
                  setCurrent(
                    (current + TESTIMONIALS.length - 1) % TESTIMONIALS.length,
                  )
                }
              >
                <ArrowLeftIcon size={22} />
              </button>
              <button
                aria-label="Next testimonial"
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

export const FaqSection = () => (
  <section
    className="home-section home-faq"
    id="faq"
    aria-labelledby="faq-heading"
  >
    <div>
      <SectionLabel>A little clarity</SectionLabel>
      <div id="faq-heading">
        <SectionTitle>Questions brands ask us.</SectionTitle>
      </div>
      <p className="home-faq-intro">
        Still have something on your mind?
        <br />
        <Link to="/#contact" className="home-text-link">
          Let’s talk it through <ArrowUpRightIcon size={18} />
        </Link>
      </p>
    </div>
    <div className="home-faq-list">
      {FAQS.map((faq, index) => (
        <details key={faq.question} name="home-faq">
          <summary>
            <span className="home-faq-number">0{index + 1}</span>
            <span>{faq.question}</span>
            <PlusIcon size={21} aria-hidden="true" />
          </summary>
          <div className="home-faq-answer">
            <p>{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  </section>
);
