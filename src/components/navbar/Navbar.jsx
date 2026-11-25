import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRightIcon, ListIcon } from "@phosphor-icons/react";
import { Drawer } from "@turtle-ui/components";
import { PillButton } from "@/components/common/PillButton";
import { NAV_LINKS } from "@/constants/constants";
import { contactClick, openContactModal } from "@/components/contact/contactActions";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5 lg:px-10">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded focus:bg-bee-yellow focus:p-4 focus:text-black">Skip to content</a>
      <div className="mx-auto flex h-16 max-w-[1760px] items-center justify-between gap-5 rounded-lg border border-white/10 bg-[#171713]/90 px-5 text-white shadow-lg backdrop-blur-md lg:h-[78px] lg:px-7">
        <Link to="/" aria-label="Skalebee home" className="shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bee-yellow"><img src="/svgs/logo-horizontal-light.svg" alt="Skalebee" width="494" height="100" className="h-7 w-auto lg:h-8" /></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex xl:gap-10">
          {NAV_LINKS.map((item) => <Link key={item.to} to={item.to} className="group overflow-hidden py-2 font-mono text-[12px] uppercase tracking-wide transition-colors hover:text-bee-yellow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bee-yellow"><span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">{item.label}</span></Link>)}
        </nav>
        <PillButton to="/#contact" onClick={contactClick({ intent: "general" })} size="sm" className="!hidden lg:!inline-flex">Let’s talk</PillButton>
        <button type="button" aria-label="Open navigation menu" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(true)} className="rounded p-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-bee-yellow lg:hidden"><ListIcon size={26} /></button>
      </div>
      <Drawer isOpen={isMenuOpen} onToggle={setIsMenuOpen}>
        <Drawer.Header head="Explore Skalebee" onClose={closeMenu} />
        <Drawer.Body><nav aria-label="Mobile navigation" className="flex flex-col gap-2">{NAV_LINKS.map((item) => <Link key={item.to} to={item.to} onClick={closeMenu} className="flex items-center justify-between rounded px-3 py-4 text-2xl text-black hover:bg-bee-yellow">{item.label}<ArrowUpRightIcon size={24} /></Link>)}</nav></Drawer.Body>
        <Drawer.Footer><PillButton to="/#contact" onClick={(e) => { e.preventDefault(); closeMenu(); setTimeout(() => openContactModal({ intent: "general" }), 250); }} block>Start a conversation</PillButton></Drawer.Footer>
      </Drawer>
    </header>
  );
};
