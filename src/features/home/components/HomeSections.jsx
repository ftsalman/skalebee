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
  <section className="home-brand-strip" aria-label="Our focus">
    <SectionLabel>Good creative. Real growth.</SectionLabel>
    <Marquee duration={32} pauseOnHover className="home-brand-marquee">
      {["Strategy", "Performance", "Creators", "Culture", "Conversion"].map(
        (word) => (
          <span className="home-brand-word" key={word}>
            {word}
            <img src="/svgs/icon.svg" width="28" height="28" alt="" />
          </span>
        ),
      )}
    </Marquee>
  </section>
);

const projectImages = [
  {
    src: "/imgs/home/fashion.jpg",
    alt: "Clothing collection on a studio rack",
  },
  {
    src: "/imgs/home/coffee.jpg",
    alt: "Orange coffee cup against a turquoise backdrop",
  },
  {
    src: "/imgs/home/skincare.jpg",
    alt: "Skincare bottles in a softly lit product composition",
  },
  {
    src: "/imgs/home/workspace.jpg",
    alt: "A laptop and monitor in an evening workspace",
  },
];

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
      <img className="home-dialog-image" {...projectImages[index]} />
      <div className="home-dialog-content">
        <SectionLabel>Sample campaign</SectionLabel>
        <h2 id="project-dialog-title">{project.client}</h2>
        <p>{project.category}</p>
        <div className="home-dialog-result">
          <strong>{project.result}</strong>
          <span>{project.resultLabel}</span>
        </div>
        <p className="home-muted">
          Illustrative project from the existing Skalebee content. Client names
          and results are sample data; photography is illustrative.
        </p>
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
          <SectionTitle>
            Good things happen when we make a little buzz.
          </SectionTitle>
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
                aria-label={`Explore ${project.client} sample campaign`}
              >
                <div
                  className="home-project-visual"
                  onPointerEnter={followCursor}
                  onPointerMove={followCursor}
                >
                  <img
                    {...projectImages[index]}
                    loading="lazy"
                    width="1400"
                    height="1050"
                  />
                  <span className="home-project-cursor" aria-hidden="true">
                    See project <ArrowRightIcon size={15} weight="bold" />
                  </span>
                  <span className="home-project-number">
                    0{index + 1} / SAMPLE CAMPAIGN
                  </span>
                  <span className="home-project-result">
                    <strong>{project.result}</strong>
                    <span>{project.resultLabel}</span>
                  </span>
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
      <p className="home-content-note">
        A preview of what growth can look like. These projects and results are
        illustrative sample content.
      </p>
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
    <SectionLabel>Small team. Big ambition.</SectionLabel>
    <div className="home-about-heading" id="about-heading">
      <SectionTitle>Built to scale what already works.</SectionTitle>
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
    <p className="home-content-note">
      Sample metrics from your existing content — replace with verified results
      before publishing.
    </p>
    <div className="home-about-grid">
      <div className="home-portrait" data-home-parallax-frame>
        {/* Stand-in photo: replace with a team portrait (put it in /public/imgs and update src, alt, width, height) */}
        <img
          src="/imgs/home/workspace.jpg"
          alt="The Skalebee team workspace"
          width="1400"
          height="2487"
          loading="lazy"
          data-home-parallax
        />
        <div className="home-portrait-caption">
          <span>Meet your growth partner.</span>
          <img src="/svgs/icon.svg" alt="" width="32" height="32" />
        </div>
      </div>
      <div className="home-about-copy" data-animate="fade-up">
        <SectionLabel>People behind the performance</SectionLabel>
        <h3>
          Your ambition.
          <br />
          Our everyday obsession.
        </h3>
        <p>
          We bring strategy, creative and performance together, so your brand
          can grow with a clear direction.
        </p>
        <p>
          From the first brief to the next big campaign, we stay close to the
          work and closer to your goals. You get a team that asks better
          questions, tests new ideas and shares what’s working.
        </p>
        <ul>
          {WHY_US.points.map((point) => (
            <li key={point}>
              <CheckIcon size={18} aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
        <PillButton to="/#contact">Meet your next growth team</PillButton>
      </div>
    </div>
    <div className="home-platforms">
      <SectionLabel>Where we make it happen</SectionLabel>
      <div>
        {["Meta", "Google", "YouTube", "Instagram", "LinkedIn"].map((name) => (
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
      <SectionLabel>The way we work</SectionLabel>
      <div id="process-heading">
        <SectionTitle>Less guesswork. More forward.</SectionTitle>
      </div>
      <p>
        A clear process. An open conversation. And a little more momentum every
        week.
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
        <span className="home-label">Sample testimonials</span>
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
        <SectionTitle>Good questions. Straight answers.</SectionTitle>
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
