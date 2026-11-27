import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";
import { AnimatedText } from "@/components/common/AnimatedText";
import { PillButton } from "@/components/common/PillButton";
import { contactClick } from "@/components/contact/contactActions";
import { hoverTo } from "@/hooks/useHoverMotion";
import { ROUTES } from "@/constants/constants";
import {
  SERVICE_PAGES,
  SERVICES_UPDATED,
  formatDate,
  readMinutes,
  sectionId,
  servicePath,
} from "../constants/servicesData";
import { ArticleSidebar, BackPill } from "./ArticleSidebar";
import { ServiceFigure, ServiceHero } from "./ServiceMedia";
import {
  BODY,
  COLUMN,
  DIVIDER,
  MONO,
  MONO_MUTED,
  PAGE,
  SECTION_NUMBER,
  SECTION_TITLE,
  TITLE,
} from "./serviceStyles";

// Vertical rhythm: 120px between blocks, 90px from a rule to its content (at 1920px)
const GAP = "mt-[clamp(64px,6.3vw,120px)]";
const INSET = "pt-[clamp(52px,4.7vw,90px)]";

const number = (i) => String(i + 1).padStart(2, "0");

/** Head of the article: title, meta line, the info row and the summary row. */
const ArticleHeader = ({ page, backTo }) => (
  <header className={COLUMN}>
    <BackPill to={backTo} className="mb-10 min-[1280px]:hidden" />
    <AnimatedText as="h1" className={TITLE}>{page.title}</AnimatedText>

    <p className={cn(MONO_MUTED, "mt-[26px] mb-0 tablet:mt-[34px]")}>
      {[
        `Skalebee ${page.category.toLowerCase()} service`,
        `${readMinutes(page)} min read`,
        `Last updated ${formatDate(page.updated ?? SERVICES_UPDATED)}`,
      ].join(" · ")}
    </p>

    <dl className={cn("mt-9 mb-0 flex flex-wrap gap-x-[30px] gap-y-4 border-y py-[30px] tablet:mt-[46px]", DIVIDER)}>
      {page.info.map((item) => (
        <div key={item.label}>
          <dt className={MONO_MUTED}>{item.label}</dt>
          <dd className={cn(MONO, "m-0 mt-1 text-svc-ink")}>{item.value}</dd>
        </div>
      ))}
    </dl>

    <dl className={cn("mt-[45px] mb-0 grid grid-cols-3 gap-x-10 gap-y-7 border-y py-[30px] max-tablet:mt-9 max-tablet:grid-cols-1", DIVIDER)}>
      {page.summary.map((item) => (
        <div key={item.label}>
          <dt className={MONO_MUTED}>{item.label}</dt>
          <dd className="m-0 mt-2.5 max-w-[236px] text-[17px] leading-[1.47] tablet:text-[18px] max-tablet:max-w-none">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  </header>
);

const ArticleSection = ({ section, index }) => {
  const id = sectionId(section, index);
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className={cn(GAP, "scroll-mt-10 outline-none")}>
      <div className={cn(COLUMN, "border-t", DIVIDER, INSET)}>
        <p className={cn(SECTION_NUMBER, "m-0")} aria-hidden="true">{number(index)}</p>
        <AnimatedText as="h2" id={`${id}-title`} className={SECTION_TITLE}>
          {section.title}
        </AnimatedText>
        <div className="mt-5 tablet:mt-[22px]">
          {section.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className={BODY}>{paragraph}</p>
          ))}
        </div>
      </div>
      {section.figure && (
        <div className={cn(GAP, "max-tablet:mt-12")}>
          <ServiceFigure {...section.figure} />
        </div>
      )}
    </section>
  );
};

/** Closing block: the next service, and a way to start. */
const ArticleEnd = ({ page }) => {
  const index = SERVICE_PAGES.indexOf(page);
  const next = SERVICE_PAGES[(index + 1) % SERVICE_PAGES.length];
  return (
    <footer className={cn(COLUMN, GAP, "border-t", DIVIDER, INSET)}>
      <p className={cn(MONO_MUTED, "m-0")}>Next service</p>
      <Link
        to={servicePath(next.slug)}
        data-hover=""
        className="group mt-4 flex items-center justify-between gap-6 text-[clamp(25px,1.9vw,30px)] leading-[1.25] tracking-[-0.03em] text-svc-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bee-yellow"
      >
        <span>{next.name}</span>
        <span
          aria-hidden="true"
          className="grid size-12 flex-none place-items-center rounded-full bg-[#f3f4f7] text-[#3e3f55]"
          {...hoverTo({ x: 6, backgroundColor: "#ffd400", duration: 0.3 })}
        >
          <ArrowRightIcon size={20} />
        </span>
      </Link>

      <div className={cn("mt-[clamp(52px,4.7vw,90px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-6 rounded-[24px] bg-[#f3f4f7] p-[clamp(22px,2.4vw,36px)]")}>
        <div className="max-w-[420px]">
          <p className="m-0 text-[clamp(21px,1.5vw,24px)] leading-[1.3] tracking-[-0.025em]">
            Want this for your business?
          </p>
          <p className="mt-2 mb-0 text-[17px] leading-[1.55] text-[#6b6d86]">
            Start with a free growth audit. We reply within 24 hours.
          </p>
        </div>
        <PillButton to="/#contact" onClick={contactClick({ intent: "proposal" })}>
          Get a free growth audit
        </PillButton>
      </div>
    </footer>
  );
};

export const ServiceArticle = ({ page }) => {
  const backTo = ROUTES.SERVICES;
  const items = page.sections.map((section, i) => ({
    id: sectionId(section, i),
    label: section.nav ?? section.title,
  }));

  return (
    <article className={PAGE}>
      <ArticleSidebar back={{ to: backTo }} items={items} />
      <ArticleHeader page={page} backTo={backTo} />
      <div className={GAP}>
        <ServiceHero {...page.hero} tint={page.tint} />
      </div>
      {page.sections.map((section, i) => (
        <ArticleSection key={section.title} section={section} index={i} />
      ))}
      <ArticleEnd page={page} />
    </article>
  );
};
