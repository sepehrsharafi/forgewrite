"use client";

import { Suspense, useEffect, useState, use } from "react";
import ContentHeader from "@/app/UI/layout/ContentHeader";
import Motion from "@/app/UI/layout/MotionContainer";
import MyLottieComponent from "@/lib/LottieMotion";
import ServicesSkeleton from "@/app/UI/services/ServicesSkeleton";
import ContentSection from "@/app/UI/layout/ContentSection";
import ServicesView from "./View";
import type { ServicesData } from "@/lib/sanity/types";

const mobileMotionMap: Record<string, string> = {
  engineers: "/motion/Mobile-responsive/M-Services-1.json",
  fieldSupport: "/motion/Mobile-responsive/M-Services-2.json",
  officeManagers: "/motion/Mobile-responsive/M-Services-3.json",
};

const desktopMotionMap: Record<string, string> = {
  engineers: "/motion/Medium Desktop - responsive/D1- Services-1.json",
  fieldSupport: "/motion/Medium Desktop - responsive/D1- Services-2.json",
  officeManagers: "/motion/Medium Desktop - responsive/D1- Services-3.json",
};

type ServicesPageProps = {
  servicesDataPromise: Promise<ServicesData>;
};

type ServicesContentProps = {
  servicesDataPromise: Promise<ServicesData>;
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
};

function ServicesContent({
  servicesDataPromise,
  activeCategoryId,
  onCategoryChange,
}: ServicesContentProps) {
  const servicesData = use(servicesDataPromise);

  useEffect(() => {
    if (!servicesData.categories.length) {
      return;
    }

    const hasActiveCategory = servicesData.categories.some(
      (category) => category.id === activeCategoryId
    );

    if (!hasActiveCategory) {
      onCategoryChange(servicesData.categories[0]?.id ?? "engineers");
    }
  }, [servicesData, activeCategoryId, onCategoryChange]);

  return (
    <ServicesView
      servicesData={servicesData}
      activeCategoryId={activeCategoryId}
      onCategoryChange={onCategoryChange}
    />
  );
}

export default function ServicesPage({
  servicesDataPromise,
}: ServicesPageProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("engineers");

  const motionLocation =
    mobileMotionMap[activeCategoryId] ?? mobileMotionMap.engineers;
  const motionLocationDesktop =
    desktopMotionMap[activeCategoryId] ?? desktopMotionMap.engineers;

  return (
    <>
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
        <Suspense fallback={<ServicesSkeleton />}>
          <ServicesContent
            servicesDataPromise={servicesDataPromise}
            activeCategoryId={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
          />
        </Suspense>
      </ContentSection>
      <div className="border-b-2 border-t-2 border-[#646464] hidden xl:block">
        <Motion>
          <MyLottieComponent motionLocation={motionLocationDesktop} />
        </Motion>
      </div>
    </>
  );
}
