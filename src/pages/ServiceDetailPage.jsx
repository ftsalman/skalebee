import { useParams } from "react-router-dom";
import { ServiceArticle } from "@/features/services/components/ServiceArticle";
import { getServicePage } from "@/features/services/constants/servicesData";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const ServiceDetailPage = () => {
  const { slug } = useParams();
  const page = getServicePage(slug);
  // key: a fresh article (scroll spy, reveal animations) for each service
  return page ? <ServiceArticle key={page.slug} page={page} /> : <NotFoundPage />;
};
