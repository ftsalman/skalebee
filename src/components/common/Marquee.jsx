import { cn } from "@turtle-ui/utils";

/**
 * Endless horizontal scroller. Children are rendered twice so the loop is seamless.
 *   <Marquee duration={25} reverse>{items}</Marquee>
 */
export const Marquee = ({
  children,
  duration = 30,
  reverse = false,
  pauseOnHover = false,
  className,
  trackClassName,
}) => (
  <div
    className={cn("flex overflow-hidden", pauseOnHover && "marquee-pause", className)}
    style={{ "--marquee-duration": `${duration}s` }}
  >
    <div
      className={cn(
        "marquee-track flex w-max shrink-0",
        reverse ? "animate-marquee-reverse" : "animate-marquee",
        trackClassName,
      )}
    >
      <div className="flex shrink-0 items-center">{children}</div>
      <div className="flex shrink-0 items-center" aria-hidden="true">
        {children}
      </div>
    </div>
  </div>
);
