import { Metadata } from "next";
import ServicesPage from "./ServicesPage";
import { getServicesPageData } from "@/lib/sanity/services";
import ServicesView from "./View";

export const metadata: Metadata = {
  title: "Services | Forgewrite",
  description:
    "ForgeWrite offers end-to-end professional engineering services designed to solve complex challenges with accuracy, speed, and code-aligned clarity. From concept to closeout.",
};

async function Services() {
  const servicesData = await getServicesPageData();
  return <ServicesView servicesData={servicesData} />;
}

export default function Page() {
  return (
    <ServicesPage>
      <Services />
    </ServicesPage>
  );
}
