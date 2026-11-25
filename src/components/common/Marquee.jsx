import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@turtle-ui/utils";

gsap.registerPlugin(useGSAP);

/**
 * Endless horizontal scroller, run by GSAP. Children are rendered twice so the loop is seamless.
 *   <Marquee duration={25} reverse>{items}</Marquee>
 * pauseOnHover eases the loop to a stop while the pointer is over it.
 */
export const Marquee = ({
  children,
  duration = 30,
  reverse = false,
  pauseOnHover = false,
  className,
  trackClassName,
}) => {
  const rootRef = useRef(null);
  const loopRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const track = rootRef.current.firstElementChild;
      // One copy's width is half the track, so -50% lands exactly where it started.
      loopRef.current = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 },
      );
      return () => { loopRef.current = null; };
    });
    return () => mm.revert();
  }, { scope: rootRef, dependencies: [duration, reverse] });

  const setSpeed = (timeScale) => {
    if (loopRef.current) gsap.to(loopRef.current, { timeScale, duration: 0.6, ease: "power2.out", overwrite: true });
  };

  return (
    <div
      ref={rootRef}
      className={cn("flex overflow-hidden", className)}
      onPointerEnter={pauseOnHover ? () => setSpeed(0) : undefined}
      onPointerLeave={pauseOnHover ? () => setSpeed(1) : undefined}
    >
      <div className={cn("flex w-max shrink-0", trackClassName)}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};
