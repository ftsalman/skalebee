import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/navbar/Navbar";
import { Footer } from "../components/footer/Footer";
import { ContactModal } from "@/components/contact/ContactModal";
import { BuildCtaSection } from "@/features/home/components/BuildCtaSection";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import usePageSeo from "@/hooks/usePageSeo";
import useHoverMotion from "@/hooks/useHoverMotion";
import { ROUTES } from "@/constants/constants";

export const MainLayout = () => {
  useSmoothScroll();
  useHoverMotion(); // GSAP hover effects for every [data-hover] element
  const { pathname } = useLocation();
  usePageSeo(pathname);
  // The navbar is a dock floating at the bottom of the screen, so pages need no top
  // offset for it; non-home pages just get a little breathing room at the top.
  const isHome = pathname === ROUTES.HOME;

  return (
    <div className="flex min-h-dvh flex-col bg-bee-cream">
      <Navbar />
      {/* Full width: each page/section sets its own container */}
      <main id="main-content" tabIndex={-1} className={`flex flex-1 flex-col ${isHome || pathname === "/about" ? "" : "pt-12 lg:pt-20"}`}>
        <Outlet />
      </main>
      <Footer rounded={isHome} />
      {/* Home ends with the floating work field, showing behind the footer's rounded corners */}
      {isHome && <BuildCtaSection />}
      {/* Site-wide contact popup: open with openContactModal() */}
      <ContactModal />
    </div>
  );
};
