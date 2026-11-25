import { Link } from "react-router-dom";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";
import { AnimatedText } from "@/components/common/AnimatedText";
import { hoverTo } from "@/hooks/useHoverMotion";
import { LABEL, TITLE } from "./homeStyles";

// Shared building blocks for the home page sections. Class strings live in homeStyles.js.

// Small mono label: [ SELECTED WORK ]
export const SectionLabel = ({ children, light = false, className }) => (
  <p className={cn(LABEL, light && "text-[#bdbdb3]", className)}>
    <span aria-hidden="true">[</span> {children} <span aria-hidden="true">]</span>
  </p>
);

// Big section title, words slide up on scroll (useScrollAnimations)
export const SectionTitle = ({ children, className }) => (
  <AnimatedText text={children} className={cn(TITLE, className)} />
);

// Underlined link with an arrow that nudges up-right on hover (GSAP)
export const TextLink = ({ to, children, iconSize = 21, className, ...props }) => (
  <Link
    to={to}
    data-hover=""
    className={cn(
      "inline-flex items-center justify-between gap-[22px] whitespace-nowrap border-b border-current pb-[9px] text-sm",
      className,
    )}
    {...props}
  >
    {children}
    <ArrowUpRightIcon size={iconSize} className="shrink-0" {...hoverTo({ x: 3, y: -3, duration: 0.3 })} />
  </Link>
);
