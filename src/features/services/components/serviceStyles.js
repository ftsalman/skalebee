/*
  Shared Tailwind class strings for the service pages (article layout).
  Sizes are taken from the 1920px reference: an 800px reading column, 1020px wide media,
  and a sticky sidebar on the left from 1280px up.
*/

// Reading column and wide media (both centred on the page)
export const COLUMN = "mx-auto w-[min(100%,800px)]";
export const WIDE = "mx-auto w-[min(100%,1020px)]";

// Page frame: white, room for the floating dock at the bottom
export const PAGE =
  "relative flex-1 bg-white px-[22px] pt-[clamp(96px,8.9vw,170px)] pb-[clamp(120px,10vw,170px)] text-svc-ink tablet:px-gutter";

export const DIVIDER = "border-[#e6e7ee]";

// Small mono text: meta line, labels, captions
export const MONO = "font-home-mono text-[13px] leading-[1.55] tablet:text-[15px]";
export const MONO_MUTED = `${MONO} text-[#6b6f8e]`;

export const TITLE =
  "m-0 max-w-[620px] text-balance text-[clamp(36px,3.4vw,52px)] font-normal leading-[1.13] tracking-[-0.055em]";

export const SECTION_NUMBER = "text-[18px] leading-none text-[#7a7c95] tablet:text-[20px]";
export const SECTION_TITLE =
  "mt-6 mb-0 text-[clamp(25px,1.9vw,30px)] font-normal leading-[1.25] tracking-[-0.03em] tablet:mt-[34px]";
export const BODY =
  "m-0 text-[17px] leading-[1.7] tablet:text-[20px] [&+&]:mt-[1.1em]";

// Rounded media card
export const CARD = "relative overflow-hidden rounded-[18px] tablet:rounded-[24px]";
