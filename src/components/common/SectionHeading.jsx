import { cn } from "@turtle-ui/utils";
import { AnimatedText } from "./AnimatedText";

// Small label + big animated title + optional description
export const SectionHeading = ({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  dark = false,
  className,
}) => (
  <div
    className={cn(
      "flex max-w-3xl flex-col gap-4",
      align === "center" ? "mx-auto items-center text-center" : "items-start",
      className,
    )}
  >
    {eyebrow && (
      <span
        data-animate="fade-up"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold uppercase tracking-wider",
          dark
            ? "border-white/15 bg-white/5 text-bee-yellow"
            : "border-black/10 bg-white text-bee-ink",
        )}
      >
        <img src="/svgs/icon.svg" alt="" className="size-4" />
        {eyebrow}
      </span>
    )}
    <AnimatedText
      as="h2"
      text={title}
      highlight={highlight}
      highlightClassName={dark ? "text-bee-yellow" : "text-bee-gold"}
      className={cn(
        "text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[64px]",
        dark ? "text-white" : "text-bee-ink",
      )}
    />
    {description && (
      <p
        data-animate="fade-up"
        data-delay="0.15"
        className={cn(
          "max-w-2xl text-lg leading-relaxed",
          dark ? "text-white/60" : "text-black/60",
        )}
      >
        {description}
      </p>
    )}
  </div>
);
