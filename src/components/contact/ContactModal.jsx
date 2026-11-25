import { useEffect, useRef, useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import { BriefSection } from "@/features/contact/BriefSection";
import { CONTACT_EVENT } from "./contactActions";
import "./contact.css";

/** Site-wide contact popup. Open it with openContactModal() from contactActions.js. */
export const ContactModal = () => {
  const dialogRef = useRef(null);
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
    dialog.querySelector(".cmodal-close")?.focus({ preventScroll: true });
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
    dialog.classList.add("is-closing");
    const done = () => {
      dialog.classList.remove("is-closing");
      dialog.close();
      setState(null);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) done();
    else setTimeout(done, 220);
  };

  return (
    <dialog
      ref={dialogRef}
      className="cmodal"
      aria-label="Contact Skalebee"
      data-lenis-prevent
      onCancel={(e) => { e.preventDefault(); close(); }}
      onMouseDown={(e) => {
        // click on the backdrop (outside the panel) closes
        if (e.target === e.currentTarget) close();
      }}
    >
      {state && (
        <div className="cmodal-panel is-brief">
          <button type="button" className="cmodal-close" aria-label="Close" onClick={close}>
            <XIcon size={22} />
          </button>
          <BriefSection key={state.key} variant="modal" headingLevel="h2" intent={state.intent} />
        </div>
      )}
    </dialog>
  );
};
