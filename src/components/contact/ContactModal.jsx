import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { XIcon } from "@phosphor-icons/react";
import { BriefSection } from "@/features/contact/BriefSection";
import { hoverTo } from "@/hooks/useHoverMotion";
import { CONTACT_EVENT } from "./contactActions";

const REDUCED = "(prefers-reduced-motion: reduce)";
const SHEET = "(max-width: 640px)"; // phones: the popup is a bottom sheet

/** Site-wide contact popup. Open it with openContactModal() from contactActions.js. */
export const ContactModal = () => {
  const dialogRef = useRef(null);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const closing = useRef(false);
  const [state, setState] = useState(null); // null = closed, otherwise { intent, service, key }

  useEffect(() => {
    const open = (e) => setState({ intent: e.detail?.intent || "general", service: e.detail?.service, key: Date.now() });
    window.addEventListener(CONTACT_EVENT, open);
    return () => window.removeEventListener(CONTACT_EVENT, open);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !state) return;
    const returnFocus = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    if (!dialog.open) dialog.showModal();
    // The panel slides in from below; focusing while it is still off-screen would scroll the
    // dialog down, so start at the top and focus the close button without scrolling.
    dialog.scrollTop = 0;
    closeRef.current?.focus({ preventScroll: true });

    // Open: backdrop fades in, panel rises (a full slide-up sheet on phones).
    if (!window.matchMedia(REDUCED).matches) {
      gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power1.out" });
      gsap.fromTo(
        panelRef.current,
        window.matchMedia(SHEET).matches ? { yPercent: 100 } : { autoAlpha: 0, y: 28, scale: 0.97 },
        { yPercent: 0, autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" },
      );
    }
    return () => {
      document.body.style.overflow = oldOverflow;
      window.__lenis?.start();
      if (returnFocus instanceof HTMLElement) returnFocus.focus({ preventScroll: true });
    };
  }, [state]);

  // Play the closing animation, then really close
  const close = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return setState(null);
    if (closing.current) return;
    closing.current = true;
    const done = () => {
      closing.current = false;
      dialog.close();
      setState(null);
    };
    if (window.matchMedia(REDUCED).matches) return done();
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.22, ease: "power1.in" });
    gsap.to(panelRef.current, {
      ...(window.matchMedia(SHEET).matches ? { yPercent: 100 } : { autoAlpha: 0, y: 16, scale: 0.98 }),
      duration: 0.22,
      ease: "power2.in",
      onComplete: done,
    });
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-0 grid h-full max-h-none w-full max-w-none place-items-center overflow-y-auto overscroll-contain border-0 bg-transparent p-6 not-open:hidden backdrop:bg-transparent max-sm:items-start max-sm:justify-items-stretch max-sm:p-0"
      aria-label="Contact Skalebee"
      data-lenis-prevent
      onCancel={(e) => { e.preventDefault(); close(); }}
      onMouseDown={(e) => {
        // click on the backdrop (outside the panel) closes
        if (e.target === e.currentTarget || e.target === overlayRef.current) close();
      }}
    >
      {/* Our own backdrop (::backdrop can't be animated by GSAP) */}
      <div ref={overlayRef} className="fixed inset-0 bg-[rgba(15,15,18,0.55)] backdrop-blur-[6px]" aria-hidden="true" />
      {state && (
        <div
          ref={panelRef}
          className="relative z-[1] m-auto w-[min(900px,100%)] rounded-[28px] bg-white px-[clamp(18px,3vw,34px)] pt-[34px] pb-[26px] shadow-[0_40px_100px_rgba(0,0,0,0.35)] max-sm:mx-0 max-sm:mt-auto max-sm:mb-0 max-sm:w-full max-sm:rounded-[24px_24px_0_0]"
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={close}
            data-hover=""
            {...hoverTo({ rotate: 90, backgroundColor: "#ffd400", duration: 0.25 })}
            className="absolute top-[18px] right-[18px] grid size-11 cursor-pointer place-items-center rounded-full border-0 bg-white text-[#17171b] shadow-[0_4px_12px_rgba(0,0,0,0.08)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-bee-yellow"
          >
            <XIcon size={22} />
          </button>
          <BriefSection key={state.key} variant="modal" headingLevel="h2" intent={state.intent} />
        </div>
      )}
    </dialog>
  );
};
