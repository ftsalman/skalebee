import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";
import { AnimatedText } from "@/components/common/AnimatedText";
import { hoverTo } from "@/hooks/useHoverMotion";
import { ROUTES } from "@/constants/constants";
import { SERVICES } from "@/features/home/constants/homeData";
import {
  SERVICES_INDEX,
  SERVICES_UPDATED,
  SERVICE_PAGES,
  formatDate,
  servicePath,
} from "../constants/servicesData";
import { ArticleSidebar, BackPill } from "./ArticleSidebar";
import {
  BODY,
  COLUMN,
  DIVIDER,
  MONO_MUTED,
  PAGE,
  SECTION_NUMBER,
  SECTION_TITLE,
  TITLE,
} from "./serviceStyles";

const GAP = "mt-[clamp(64px,6.3vw,120px)]";
const INSET = "pt-[clamp(52px,4.7vw,90px)]";

// Short description and deliverables come from the home page's services list.
const homeService = (artwork) => SERVICES.find((s) => s.artwork === artwork);

const ServiceRow = ({ page, index }) => {
  const home = homeService(page.artwork);
  const id = page.slug;
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className={cn(GAP, "scroll-mt-10 outline-none")}>
      <div
        data-hover=""
        className={cn(COLUMN, "relative grid grid-cols-[minmax(0,1fr)_260px] items-start gap-x-12 gap-y-8 border-t max-tablet:grid-cols-1", DIVIDER, INSET)}
      >
        <div>
          <p className={cn(SECTION_NUMBER, "m-0")} aria-hidden="true">{String(index + 1).padStart(2, "0")}</p>
          <h2 id={`${id}-title`} className={SECTION_TITLE}>
            {/* Stretched link: the whole row is clickable */}
            <Link
              to={servicePath(page.slug)}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[20px] focus-visible:after:outline-2 focus-visible:after:outline-offset-8 focus-visible:after:outline-bee-yellow"
            >
              {page.name}
            </Link>
          </h2>
          <p className={cn(BODY, "mt-5 tablet:mt-[22px]")}>{home?.description ?? page.description}</p>
          {home?.points && (
            <p className={cn(MONO_MUTED, "mt-5 mb-0")}>{home.points.join(" · ")}</p>
          )}
          <span className="mt-7 inline-flex items-center gap-2.5 text-[17px] text-[#3e3f55]">
            How we run it
            <span {...hoverTo({ x: 5, duration: 0.3 })} className="inline-flex">
              <ArrowRightIcon size={18} aria-hidden="true" />
            </span>
          </span>
        </div>
        <div
          className="relative mt-[46px] grid aspect-[1.2] place-items-center overflow-hidden rounded-[20px] max-tablet:mt-0"
          style={{ backgroundColor: page.tint }}
        >
          <img
            src={page.hero.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-[78%] rounded-[10px] shadow-[0_14px_34px_-16px_rgba(20,24,60,0.45)]"
            {...hoverTo({ scale: 1.04, duration: 0.6 })}
          />
        </div>
      </div>
    </section>
  );
};

export const ServicesIndex = () => {
  const items = SERVICE_PAGES.map((page) => ({ id: page.slug, label: page.name }));

  return (
    <article className={PAGE}>
      <ArticleSidebar back={{ to: ROUTES.HOME }} items={items} label="Services" />
      <header className={COLUMN}>
        <BackPill to={ROUTES.HOME} className="mb-10 min-[1280px]:hidden" />
        <AnimatedText as="h1" className={TITLE}>{SERVICES_INDEX.title}</AnimatedText>
        <p className={cn(MONO_MUTED, "mt-[26px] mb-0 tablet:mt-[34px]")}>
          {`${SERVICE_PAGES.length} services · UAE & India · Last updated ${formatDate(SERVICES_UPDATED)}`}
        </p>
        <div className={cn("mt-9 border-t pt-[30px] tablet:mt-[46px]", DIVIDER)}>
          <p className={BODY}>{SERVICES_INDEX.intro}</p>
        </div>
      </header>
      {SERVICE_PAGES.map((page, i) => (
        <ServiceRow key={page.slug} page={page} index={i} />
      ))}
    </article>
  );
};
