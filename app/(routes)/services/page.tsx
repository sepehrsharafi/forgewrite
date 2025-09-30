import { Metadata } from "next";
import ServicesPage from "./ServicesPage";
import { getServicesPageData } from "@/lib/sanity/services";

export const metadata: Metadata = {
  title: "Services | Forgewrite",
  description:
    "ForgeWrite offers end-to-end professional engineering services designed to solve complex challenges with accuracy, speed, and code-aligned clarity. From concept to closeout.",
};

export default function Page() {
  const servicesDataPromise = getServicesPageData();
  return <ServicesPage servicesDataPromise={servicesDataPromise} />;
}
