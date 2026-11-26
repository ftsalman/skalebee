import { useRef } from "react";
import useScrollAnimations from "@/hooks/useScrollAnimations";
import { AboutSection } from "../components/AboutSection";
import { Hero } from "../components/Hero";
import {
  BrandStrip,
  FeaturedWork,
  TestimonialsSection,
} from "../components/HomeSections";
import { FaqSection } from "../components/FaqSection";
import { PlatformsOrbit } from "../components/PlatformsOrbit";
import {
  CertificationsSection,
  LeadToSalesSection,
  PricingSection,
  ReviewsSection,
} from "../components/BusinessSections";
import { MetaSpecialistSection } from "../components/MetaSpecialistSection";
import { ServicesSection } from "../components/ServicesSection";
import { ProcessSection } from "../components/ProcessSection";
import { BriefSection } from "@/features/contact/BriefSection";
import useHomeMotion from "@/hooks/useHomeMotion";
import { SECTION_Y } from "../components/homeStyles";

// Page-wide: paper background, section anchors clear the top of the screen, and one
// orange focus ring for every link, button and FAQ question.
const PAGE = [
  "bg-home-paper text-home-ink",
  // Phones: wide artwork must not widen the page's scroll area
  "max-sm:relative max-sm:overflow-x-clip",
  "[&_section[id]]:scroll-mt-[125px] max-tablet:[&_section[id]]:scroll-mt-[95px]",
  "[&_:is(button,summary)]:cursor-pointer",
  "[&_:is(button,a,summary):focus-visible]:outline-3 [&_:is(button,a,summary):focus-visible]:outline-offset-[6px] [&_:is(button,a,summary):focus-visible]:outline-[#cf6300]",
].join(" ");

// Home page: sections in order. Scroll animations are applied to all of them here.
export const Home = () => {
  const scopeRef = useRef(null);
  useScrollAnimations(scopeRef);
  useHomeMotion(scopeRef);

  return (
    <div ref={scopeRef} className={PAGE}>
      <Hero />
      <AboutSection />
      {/* 1. Introduce */}
      <BrandStrip />
      <PlatformsOrbit />
      {/* 2. What we do */}
      <ServicesSection />
      <LeadToSalesSection />
      {/* 3. Proof */}
      <FeaturedWork />
      {/* 4. Who we are */}
      <MetaSpecialistSection />
      {/* <CertificationsSection /> */}
      {/* 5. How we work */}
      <ProcessSection />
      <ReviewsSection />
      {/* <PricingSection /> */}
      {/* 6. Trust */}
      <TestimonialsSection />
      <FaqSection />
      {/* 7. Contact */}
      <div className="bg-white">
        <BriefSection id="contact" headingLevel="h2" className={SECTION_Y} />
      </div>
    </div>
  );
};
