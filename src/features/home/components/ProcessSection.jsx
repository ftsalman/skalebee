import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  BooksIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TargetIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import { APPROACH } from "../constants/homeData";

const imageFolder = "/imgs/home/process";
const marks = {
  campaigns: { src: `${imageFolder}/meta.webp`, size: "size-full" },
  "google-ads": {
    src: `${imageFolder}/google-ads-logo.png`,
    size: "size-3/5",
    colors: "bg-white",
  },
  performance: { Icon: TargetIcon, colors: "bg-[#312047] text-[#d8a5ff]" },
  search: { Icon: MagnifyingGlassIcon, colors: "bg-[#143a32] text-[#94efbd]" },
  conversations: { Icon: WhatsappLogoIcon, colors: "bg-[#137b48] text-white" },
  strategy: { src: "/svgs/icon.svg", size: "size-2/3", colors: "bg-[#151517]" },
  briefing: { Icon: BooksIcon, colors: "bg-[#342745] text-[#dfc2fc]" },
  launch: { Icon: ChartBarIcon, colors: "bg-[#263119] text-[#cbf28a]" },
};

function ProcessStep({ step, index }) {
  const [open, setOpen] = useState(false);
  const panelId = `process-detail-${index}`;
  const preview = `${imageFolder}/${step.artwork}.webp`;
  const mark = marks[step.artwork];
  return (
    <li className="border-b border-[#e3e4eb]">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          data-preview={preview}
          onClick={() => setOpen((value) => !value)}
          className="grid w-full grid-cols-[60px_minmax(0,1fr)_auto] items-start gap-5 py-[30px] text-left max-sm:grid-cols-[44px_minmax(0,1fr)_auto] max-sm:gap-3 max-sm:py-5"
        >
          <span
            aria-hidden="true"
            className={`grid aspect-square w-full place-items-center overflow-hidden rounded-full ring-1 ring-black/5 ${mark.colors ?? ""}`}
          >
            {mark.src ? (
              <img
                src={mark.src}
                alt=""
                width="60"
                height="60"
                loading="lazy"
                className={`object-contain ${mark.size}`}
              />
            ) : (
              <mark.Icon weight="bold" className="size-[52%]" />
            )}
          </span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-baseline gap-x-4">
              <span className="text-2xl font-medium tracking-[-0.035em] max-sm:text-xl">
                {step.title}
              </span>
              <span className="text-xl tracking-[-0.02em] max-sm:text-base">
                {step.focus}
              </span>
            </span>
            <span className="mt-2 block text-[17px] leading-6 text-[#63667f] max-sm:mt-1 max-sm:text-sm">
              {step.channel}
            </span>
          </span>
          <span className="flex items-center gap-4 pt-1 max-sm:gap-1.5">
            <span className="font-home-mono text-sm max-sm:text-xs">
              <span className="max-sm:sr-only">Step </span>
              {String(index + 1).padStart(2, "0")}
            </span>
            <PlusIcon
              size={25}
              weight="thin"
              aria-hidden="true"
              className={`text-svc-muted transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-45" : ""}`}
            />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        aria-hidden={!open}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-[260ms] ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="pb-[30px] pl-20 max-sm:pl-0">
            {open && (
              <img
                src={preview}
                alt=""
                width="560"
                height="280"
                className="mb-5 hidden w-full max-w-[280px] rounded-xl [@media(hover:none)]:block motion-reduce:block"
              />
            )}
            <ul className="list-disc space-y-3.5 pl-5 text-[17px] leading-relaxed marker:text-svc-muted">
              <li>{step.description}</li>
              <li>{step.detail}</li>
            </ul>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {step.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-xl bg-white px-3.5 py-1 font-home-mono text-sm"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}

export function ProcessSection() {
  const sectionRef = useRef(null);
  const previewRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const preview = previewRef.current;
          const section = sectionRef.current;
          const controller = new AbortController();
          const options = { signal: controller.signal };
          const followX = gsap.quickTo(preview, "x", {
            duration: 0.22,
            ease: "power3.out",
          });
          const followY = gsap.quickTo(preview, "y", {
            duration: 0.22,
            ease: "power3.out",
          });
          let activeButton = null;
          let fade;

          function hide() {
            if (!activeButton) return;
            activeButton = null;
            fade?.kill();
            fade = gsap.to(preview, {
              autoAlpha: 0,
              scale: 0.94,
              duration: 0.16,
            });
          }

          function follow(event) {
            const button = event.target.closest("button[data-preview]");
            if (!button || event.pointerType === "touch") return hide();
            const x = gsap.utils.clamp(
              120,
              window.innerWidth - 120,
              event.clientX,
            );
            const y = gsap.utils.clamp(
              68,
              window.innerHeight - 68,
              event.clientY,
            );
            if (button !== activeButton) {
              if (!activeButton) {
                followX(x, x);
                followY(y, y);
              }
              activeButton = button;
              preview.src = button.dataset.preview;
              fade?.kill();
              fade = gsap.to(preview, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.18,
                ease: "power2.out",
              });
            }
            followX(x);
            followY(y);
          }

          gsap.set(preview, { scale: 0.94, xPercent: -50, yPercent: -50 });
          section.addEventListener("pointerover", follow, options);
          section.addEventListener("pointermove", follow, options);
          section.addEventListener("pointerleave", hide, options);
          section.addEventListener("pointercancel", hide, options);
          window.addEventListener("blur", hide, options);
          return () => {
            controller.abort();
            fade?.kill();
            preview.style.visibility = "hidden";
          };
        },
      );
      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-heading"
      className="bg-[#f3f4f7] px-gutter py-[clamp(72px,8vw,144px)] text-svc-ink"
    >
      <div className="mx-auto max-w-[800px]">
        <h2
          id="process-heading"
          className="mb-16 text-[clamp(34px,4vw,48px)] font-normal leading-[1.16] tracking-[-0.055em] max-sm:mb-10"
        >
          How it works.{" "}
          <span className="text-svc-muted">
            Your growth journey in eight simple steps.
          </span>
        </h2>
        <ol className="border-t border-[#e3e4eb]">
          {APPROACH.map((step, index) => (
            <ProcessStep key={step.title} step={step} index={index} />
          ))}
        </ol>
      </div>
      <img
        ref={previewRef}
        alt=""
        aria-hidden="true"
        width="224"
        height="118"
        className="pointer-events-none invisible fixed top-0 left-0 z-40 h-[118px] w-[224px] rounded-xl bg-[#15121d] object-cover opacity-0 shadow-[0_18px_40px_-8px_rgba(27,29,51,0.27)]"
      />
    </section>
  );
}
