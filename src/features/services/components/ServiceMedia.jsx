import { cn } from "@turtle-ui/utils";
import { CARD, MONO_MUTED, WIDE } from "./serviceStyles";

/** Large tinted card with the service illustration floating in the middle. */
export const ServiceHero = ({ image, alt, tint }) => (
  <div
    className={cn(WIDE, CARD, "grid aspect-[1020/760] place-items-center max-tablet:aspect-[4/3.4]")}
    style={{ backgroundColor: tint }}
  >
    <img
      src={image}
      alt={alt}
      width="900"
      height="575"
      fetchPriority="high"
      className="w-[66%] rounded-[14px] shadow-[0_24px_60px_-22px_rgba(20,24,60,0.45),0_0_0_1px_rgba(255,255,255,0.35)] tablet:rounded-[20px] max-tablet:w-[82%]"
    />
  </div>
);

const Pane = ({ image, alt, bg, cover }) => (
  <div className="relative grid min-h-0 place-items-center overflow-hidden" style={bg ? { backgroundColor: bg } : undefined}>
    <img
      src={image}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cover ? "absolute inset-0 size-full object-cover" : "w-[84%] rounded-[12px] shadow-[0_12px_32px_-18px_rgba(20,24,60,0.4)]"}
    />
  </div>
);

/**
 * Wide figure with a mono caption underneath.
 *   { image, alt, caption, bg }                       one image, centred on `bg` (or filling the card)
 *   { images: [{ image, alt, bg }, { image, alt }], caption }   split: left on a colour, right photo
 */
export const ServiceFigure = ({ image, alt, bg, images, caption }) => (
  <figure className={cn(WIDE, "my-0")}>
    {images ? (
      <div className={cn(CARD, "grid aspect-[1020/740] grid-cols-2 max-tablet:aspect-auto max-tablet:grid-cols-1 max-tablet:[&>*]:aspect-[4/3]")}>
        <Pane {...images[0]} />
        <Pane {...images[1]} cover />
      </div>
    ) : bg ? (
      <div className={cn(CARD, "grid aspect-[1020/680] place-items-center")} style={{ backgroundColor: bg }}>
        <img src={image} alt={alt} loading="lazy" decoding="async"
          className="w-[84%] rounded-[12px] shadow-[0_18px_44px_-22px_rgba(20,24,60,0.4)] tablet:rounded-[16px]" />
      </div>
    ) : (
      <div className={CARD}>
        <img src={image} alt={alt} loading="lazy" decoding="async" className="block h-auto w-full" />
      </div>
    )}
    {caption && (
      <figcaption className={cn(MONO_MUTED, "mt-3.5 px-2 text-center")}>{caption}</figcaption>
    )}
  </figure>
);
