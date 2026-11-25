// Open the site-wide contact popup from anywhere (the popup itself is ContactModal.jsx, mounted once in MainLayout).
//
//   openContactModal({ intent: "call" })                    // "call" | "proposal" | "general"
//   <Link to="/#contact" onClick={contactClick({ intent: "proposal" })}>...</Link>
//
// Links keep "/#contact" as their href, so they still work (scroll to the contact section)
// if JavaScript has not loaded yet or the click is opened in a new tab.
export const CONTACT_EVENT = "skalebee:open-contact";

export const openContactModal = (detail = {}) =>
  window.dispatchEvent(new CustomEvent(CONTACT_EVENT, { detail }));

export const contactClick = (detail) => (event) => {
  // Let modified clicks (new tab / window) behave like a normal link
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
  event.preventDefault();
  openContactModal(detail);
};
