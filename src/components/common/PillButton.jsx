import { Link } from "react-router-dom";
import { CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";
import { hoverTo } from "@/hooks/useHoverMotion";

/**
 * The site-wide button: white pill with a yellow arrow pill on the left.
 * On hover (GSAP) the arrow pill slides to the right edge and the label slides left
 * into the space it left behind.
 *
 *   <PillButton to="/#contact">Book a call</PillButton>          // router link
 *   <PillButton href="mailto:hi@x.com">Email us</PillButton>      // plain link
 *   <PillButton onClick={fn}>Send</PillButton>                    // <button>
 *   size="sm" for compact spots (navbar), block for full width.
 */
const SIZES = {
  // pad = yellow pill inset, icon = its width; the label moves left by
  // (pad + icon + gap) - its hovered left padding.
  md: {
    root: "h-[60px] pl-[88px] pr-[30px] text-[18px]",
    icon: "inset-y-[5px] left-[5px] w-[70px] text-[18px]",
    pad: 5,
    labelShift: -71,
  },
  sm: {
    root: "h-[46px] pl-[69px] pr-[20px] text-[15px]",
    icon: "inset-y-[4px] left-[4px] w-[54px] text-[15px]",
    pad: 4,
    labelShift: -55,
  },
};
const SLIDE = { duration: 0.55, ease: "power2.inOut" };

export const PillButton = ({ to, href, size = "md", block = false, className, children, ...props }) => {
  const s = SIZES[size] || SIZES.md;
  const classes = cn(
    "relative inline-flex items-center overflow-hidden whitespace-nowrap rounded-full border-0 bg-white font-sans font-normal leading-none tracking-[-0.01em] text-[#141414] no-underline normal-case cursor-pointer",
    "shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_6px_18px_-10px_rgba(0,0,0,0.22)]",
    "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-bee-yellow",
    s.root,
    block && "flex w-full",
    className,
  );
  const content = (
    <>
      <span
        className={cn("absolute grid place-items-center rounded-full bg-bee-yellow text-[#1a1a1a]", s.icon)}
        aria-hidden="true"
        // Right edge ends `pad` px from the button's right edge, whatever its width.
        {...hoverTo({ left: "100%", xPercent: -100, x: -s.pad, ...SLIDE })}
      >
        <CaretRightIcon weight="bold" />
      </span>
      <span className="inline-block" {...hoverTo({ x: s.labelShift, ...SLIDE })}>
        {children}
      </span>
    </>
  );

  const shared = { className: classes, "data-hover": "", ...props };
  if (to) return <Link to={to} {...shared}>{content}</Link>;
  if (href) return <a href={href} {...shared}>{content}</a>;
  return <button type="button" {...shared}>{content}</button>;
};
