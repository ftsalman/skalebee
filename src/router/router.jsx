import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layout/MainLayout";
import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { ServiceDetailPage } from "@/pages/ServiceDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ROUTES } from "@/constants/constants";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: ROUTES.SERVICES, element: <ServicesPage /> },
      { path: `${ROUTES.SERVICES}/:slug`, element: <ServiceDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
