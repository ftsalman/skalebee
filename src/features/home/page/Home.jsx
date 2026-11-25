import { useRef } from "react";
import useScrollAnimations from "@/hooks/useScrollAnimations";
import { Hero } from "../components/Hero";
import {
  BrandStrip,
  FeaturedWork,
  AboutSection,
  ProcessSection,
  TestimonialsSection,
  FaqSection,
} from "../components/HomeSections";
import { PlatformsOrbit } from "../components/PlatformsOrbit";
import {
  CertificationsSection,
  LeadToSalesSection,
  PricingSection,
  ReviewsSection,
} from "../components/BusinessSections";
import { MetaSpecialistSection } from "../components/MetaSpecialistSection";
import { ServicesSection } from "../components/ServicesSection";
import { BriefSection } from "@/features/contact/BriefSection";
import useHomeMotion from "@/hooks/useHomeMotion";
import "./Home.css";

// Home page: sections in order. Scroll animations are applied to all of them here.
export const Home = () => {
  const scopeRef = useRef(null);
  useScrollAnimations(scopeRef);
  useHomeMotion(scopeRef);

  return (
    <div ref={scopeRef} className="home-page">
      <Hero />
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
      <AboutSection />
      {/* 5. How we work */}
      <ProcessSection />
      <ReviewsSection />
      {/* <PricingSection /> */}
      {/* 6. Trust */}
      <TestimonialsSection />
      <FaqSection />
      {/* 7. Contact */}
      <div className="home-brief">
        <BriefSection id="contact" headingLevel="h2" />
      </div>
    </div>
  );
};
