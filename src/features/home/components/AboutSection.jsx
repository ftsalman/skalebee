import { Link } from "react-router-dom";
import { AnimatedText } from "@/components/common/AnimatedText";

export function AboutSection({ standalone = false }) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section id="about" aria-labelledby="about-heading" className="bg-white px-6 py-[clamp(64px,5vw,96px)] text-svc-ink">
      <Heading id="about-heading" className="sr-only">About Skalebee</Heading>
      <div className="mx-auto max-w-[900px]">
        <div className="max-w-[850px] space-y-[0.62em] text-[clamp(26px,3.1vw,40px)] font-normal leading-[1.345] tracking-[-0.032em]">
          <AnimatedText as="p" scrub>
            We bring <span data-ink="highlight">7 services</span> under one roof for businesses in Dubai, across the UAE and throughout India.
          </AnimatedText>
          <AnimatedText as="p" scrub>
            Our founder, Shakkeer, holds <span data-ink="pink">two Meta certifications</span> in digital marketing and business messaging. From our studio in Pattambi, Kerala, we plan campaigns, build websites and online stores, and help customers find you through search, social and WhatsApp.
          </AnimatedText>
          <AnimatedText as="p" scrub>
            You work directly with the person planning your campaigns. We track <span data-ink="blue">leads and sales</span> and show you what each result costs. You own your ad accounts and data, and you see our fee and your ad budget separately.
          </AnimatedText>
          <p>
            <Link to="/#contact" className="inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8">
              <AnimatedText as="span" scrub><span data-ink="underline">Get a free growth audit.</span></AnimatedText>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
