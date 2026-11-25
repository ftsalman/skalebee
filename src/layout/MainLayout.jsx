import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/navbar/Navbar";
import { Footer } from "../components/footer/Footer";
import { ContactModal } from "@/components/contact/ContactModal";
import { BuildCtaSection } from "@/features/home/components/BuildCtaSection";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import usePageSeo from "@/hooks/usePageSeo";
import { ROUTES } from "@/constants/constants";

export const MainLayout = () => {
  useSmoothScroll();
  const { pathname } = useLocation();
  usePageSeo(pathname);
  // The navbar floats over the page. The home hero sits behind it;
  // other pages get top space so their content starts below it.
  const isHome = pathname === ROUTES.HOME;

  return (
    <div className="flex min-h-dvh flex-col bg-bee-cream">
      <Navbar />
      {/* Full width: each page/section sets its own container */}
      <main id="main-content" tabIndex={-1} className={`flex flex-1 flex-col ${isHome ? "" : "pt-24 lg:pt-[150px]"}`}>
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
