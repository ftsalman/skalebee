import { cn } from "@turtle-ui/utils";

/*
  Shared Tailwind class strings for the home page sections.
  Breakpoints: max-tablet = phones (<=700px), max-lg = below 1024px.
*/

// Section spacing: 62px / 80px / 110px top and bottom; side gutter grows with the screen and,
// from 1800px, centres a 1640px column.
export const SECTION_X = "px-[22px] tablet:px-gutter min-[1800px]:px-[max(80px,calc((100vw-1640px)/2))]";
export const SECTION_Y = "py-[62px] tablet:py-20 lg:py-[110px]";
export const SECTION = cn(SECTION_X, SECTION_Y);

// Small mono label: [ SELECTED WORK ]
export const LABEL =
  "flex items-center gap-2 font-home-mono text-[11px] font-medium uppercase leading-[1.6] tracking-[0.035em] max-tablet:text-[10px]";

// Big section title (words slide up on scroll, see useScrollAnimations)
export const TITLE =
  "mt-7 mb-0 max-w-[980px] text-[clamp(40px,5.9vw,92px)] font-normal leading-[1.02] tracking-[-0.065em] [&_.word-inner]:pr-[0.015em] max-tablet:mt-[22px] max-tablet:text-[clamp(37px,9vw,60px)]";

// Title on the left, a link on the right (stacked on phones)
export const SECTION_HEADING =
  "mb-[58px] flex items-end justify-between gap-10 max-lg:gap-[25px] max-tablet:mb-[35px] max-tablet:block [&>div]:max-w-[76%] max-lg:[&>div]:max-w-[75%] max-tablet:[&>div]:max-w-full max-tablet:[&>a]:mt-6 max-tablet:[&>a]:inline-flex";

export const MUTED = "text-home-muted";
export const CONTENT_NOTE = "mt-5 text-[11px] leading-[1.6] text-[#6d6d63]";
