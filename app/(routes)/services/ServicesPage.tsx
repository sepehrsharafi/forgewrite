"use client";

import { Suspense, useState } from "react";
import ContentHeader from "@/app/UI/layout/ContentHeader";
import Motion from "@/app/UI/layout/MotionContainer";
import MyLottieComponent from "@/lib/LottieMotion";
import ServicesSkeleton from "@/app/UI/services/ServicesSkeleton";
import ContentSection from "@/app/UI/layout/ContentSection";
import { ServicesContext } from "./ServicesContext";

const motionMap: Record<string, string> = {
  engineers: "/motion/Mobile-responsive/M-Services-1.json",
  fieldSupport: "/motion/Mobile-responsive/M-Services-2.json",
  officeManagers: "/motion/Mobile-responsive/M-Services-3.json",
};
const motionMapDesktop: Record<string, string> = {
  engineers: "/motion/Medium Desktop - responsive/D1- Services-1.json",
  fieldSupport: "/motion/Medium Desktop - responsive/D1- Services-2.json",
  officeManagers: "/motion/Medium Desktop - responsive/D1- Services-3.json",
};

export default function ServicesPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("engineers");

  const motionLocation =
    motionMap[activeCategoryId] ??
    "/motion/Mobile-responsive/M-Services-1.json";
  const motionLocationDesktop =
    motionMapDesktop[activeCategoryId] ??
    "/motion/Medium Desktop - responsive/D1- Services-1.json";

  return (
    <ServicesContext.Provider value={{ activeCategoryId, setActiveCategoryId }}>
      <ContentSection>
        <div className="block xl:hidden -mt-6 -mx-6">
          <Motion>
            <MyLottieComponent motionLocation={motionLocation} />
          </Motion>
        </div>
        <ContentHeader
          title="Services"
          description="ForgeWrite offers end-to-end professional engineering services designed to solve complex challenges with accuracy, speed, and code-aligned clarity. From concept to closeout."
        />
        <Suspense fallback={<ServicesSkeleton />}>{children}</Suspense>
      </ContentSection>
      <div className="border-b-2 border-t-2 border-[#646464] hidden xl:block">
        <Motion>
          <MyLottieComponent motionLocation={motionLocationDesktop} />
        </Motion>
      </div>
    </ServicesContext.Provider>
  );
}
