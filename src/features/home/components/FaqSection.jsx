import { AnimatedText } from "@/components/common/AnimatedText";
import { useState } from "react";
import {
  BriefcaseIcon, ChartLineUpIcon, ChatsIcon, ClockIcon, GlobeIcon,
  ListChecksIcon, ListNumbersIcon, PlusIcon, WalletIcon,
} from "@phosphor-icons/react";
import { FAQS } from "../constants/homeData";

const icons = {
  chat: ChatsIcon, steps: ListNumbersIcon, cost: WalletIcon, prepare: ListChecksIcon,
  results: ChartLineUpIcon, globe: GlobeIcon, clock: ClockIcon, work: BriefcaseIcon,
};

const prompt = encodeURIComponent("Based on https://www.skalebee.com, what does Skalebee offer and how can I start a project?");
const assistants = [
  { name: "ChatGPT", logo: "openai", url: `https://chatgpt.com/?q=${prompt}` },
  { name: "Claude", logo: "claude-ai-icon", url: `https://claude.ai/new?q=${prompt}` },
  { name: "Perplexity", logo: "perplexity", url: `https://www.perplexity.ai/search?q=${prompt}` },
  { name: "Grok", logo: "grok", url: `https://grok.com/?q=${prompt}` },
];

export function FaqSection() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" aria-labelledby="faq-heading"
      className="bg-[linear-gradient(to_bottom,#f3f4f7_calc(100%-130px),white)] px-gutter pt-20 pb-[180px] text-svc-ink max-sm:pt-14 max-sm:pb-28">
      <div className="mx-auto max-w-[900px]">
        <AnimatedText as="h2" id="faq-heading" className="mb-16 text-center text-[clamp(34px,4vw,48px)] font-normal leading-[1.16] tracking-[-0.055em] max-sm:mb-9">
          Before we start. <span className="text-svc-muted">FAQ</span>
        </AnimatedText>
        <div className="grid gap-[14px]">
          {FAQS.map(({ question, answer, icon }) => {
            const Icon = icons[icon];
            const expanded = open === icon;
            return (
              <div key={icon} className={`rounded-[34px] border border-white shadow-[inset_0_0_30px_rgba(255,255,255,0.78)] transition-colors duration-200 hover:bg-white has-[:focus-visible]:bg-white motion-reduce:transition-none max-sm:rounded-[24px] ${expanded ? "bg-white" : "bg-transparent"}`}>
                <h3>
                  <button type="button" aria-expanded={expanded} aria-controls={`faq-answer-${icon}`}
                    onClick={() => setOpen(current => current === icon ? null : icon)}
                    className="flex min-h-[90px] w-full items-center gap-5 rounded-[inherit] px-[38px] py-5 text-left text-2xl font-medium leading-[1.3] tracking-[-0.032em] max-sm:min-h-[72px] max-sm:gap-3 max-sm:px-5 max-sm:text-[18px]">
                    <Icon size={22} weight="light" aria-hidden="true" className="shrink-0 text-svc-muted" />
                    <AnimatedText as="span" className="flex-1">{question}</AnimatedText>
                    <PlusIcon size={26} weight="thin" aria-hidden="true"
                      className={`shrink-0 text-svc-muted transition-transform duration-[240ms] ease-out motion-reduce:transition-none ${expanded ? "rotate-45" : ""}`} />
                  </button>
                </h3>
                <div id={`faq-answer-${icon}`} aria-hidden={!expanded} inert={!expanded}
                  className={`grid transition-[grid-template-rows,opacity] duration-[280ms] ease-[cubic-bezier(.22,.68,.18,1)] motion-reduce:transition-none ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="min-h-0 overflow-hidden">
                    <AnimatedText as="p" className="px-[38px] pb-10 text-[17px] leading-[1.55] max-sm:px-5 max-sm:pb-6 max-sm:text-base">{answer}</AnimatedText>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-16 text-center max-sm:mt-10">
          <AnimatedText as="p" className="text-[17px] text-[#63657e]">Still curious? Ask AI about our work</AnimatedText>
          <div className="mt-4 flex justify-center gap-3">
            {assistants.map(({ name, logo, url }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                aria-label={`Ask ${name} about Skalebee (opens in a new tab)`}
                className="group grid size-11 place-items-center rounded-full">
                <span aria-hidden="true" className="block size-[30px] overflow-hidden">
                  <span className="relative block transition-transform duration-300 ease-out group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none"
                    style={{ "--logo": `url(/imgs/brand/tools/${logo}.svg)` }}>
                    <span className="block size-[30px] bg-[#696b85] [mask:var(--logo)_center/contain_no-repeat]" />
                    <span className="absolute top-full block size-[30px] bg-[#17171c] [mask:var(--logo)_center/contain_no-repeat]" />
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
