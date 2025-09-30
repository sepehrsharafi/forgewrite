"use client";

import { Suspense, use, useEffect, useMemo, useState } from "react";
import ContentHeader from "@/app/UI/layout/ContentHeader";
import Motion from "@/app/UI/layout/MotionContainer";
import Image from "next/image";
import MyLottieComponent from "@/lib/LottieMotion";
import ServicesSkeleton from "@/app/UI/services/ServicesSkeleton";
import ContentSection from "@/app/UI/layout/ContentSection";
import { FlipButton, FlipButtonFront } from "@/app/UI/components/buttons/flip";
import { FlipButtonBack } from "@/app/UI/components/animate-ui/primitives/buttons/flip";

interface ServiceCategory {
  id: string;
  label: string;
  items: string[];
}

interface ServicesData {
  categories: ServiceCategory[];
  leaderName: string;
  leaderImageUrl: string;
}

interface ServicesResponse {
  services: ServicesData | null;
  error?: string;
}

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

function CheckIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 2xl:w-6 2xl:h-6"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.75 13.75C3.5 13.75 2.4375 13.3125 1.5625 12.4375C0.6875 11.5625 0.25 10.5 0.25 9.25V4.75C0.25 3.5 0.6875 2.4375 1.5625 1.5625C2.4375 0.6875 3.5 0.25 4.75 0.25H9.25C10.5 0.25 11.5625 0.6875 12.4375 1.5625C13.3125 2.4375 13.75 3.5 13.75 4.75V9.25C13.75 10.5 13.3125 11.5625 12.4375 12.4375C11.5625 13.3125 10.5 13.75 9.25 13.75H4.75ZM6.25 10L10.75 5.5L9.7 4.45L6.25 7.9L4.6 6.25L3.55 7.3L6.25 10Z"
        fill="#629199"
      />
    </svg>
  );
}

async function fetchServicesData(): Promise<ServicesData> {
  const response = await fetch("/api/services", {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  const payload: ServicesResponse = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Failed to fetch services data");
  }

  const { services } = payload;
  if (!services) {
    throw new Error("Services payload is empty");
  }

  return services;
}

export default function Page() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("engineers");
  const [servicesPromise, setServicesPromise] =
    useState<Promise<ServicesData> | null>(null);

  useEffect(() => {
    const promise = fetchServicesData();
    setServicesPromise(promise);
  }, []);

  const motionLocation =
    motionMap[activeCategoryId] ??
    "/motion/Mobile-responsive/M-Services-1.json";
  const motionLocationDesktop =
    motionMapDesktop[activeCategoryId] ??
    "/motion/Mobile-responsive/M-Services-1.json";

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
        {servicesPromise ? (
          <Suspense fallback={<ServicesSkeleton />}>
            <ServicesContent
              promise={servicesPromise}
              activeCategoryId={activeCategoryId}
              setActiveCategoryId={setActiveCategoryId}
            />
          </Suspense>
        ) : (
          <ServicesSkeleton />
        )}
      </ContentSection>
      <div className="border-b-2 border-t-2 border-[#646464] hidden xl:block">
        <Motion>
          <MyLottieComponent motionLocation={motionLocationDesktop} />
        </Motion>
      </div>
    </>
  );
}

function ServicesContent({
  promise,
  activeCategoryId,
  setActiveCategoryId,
}: {
  promise: Promise<ServicesData>;
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
}) {
  const servicesData = use(promise);

  useEffect(() => {
    const exists = servicesData.categories.some(
      (category) => category.id === activeCategoryId
    );
    if (!exists) {
      const fallbackId = servicesData.categories[0]?.id ?? "engineers";
      setActiveCategoryId(fallbackId);
    }
  }, [servicesData, activeCategoryId, setActiveCategoryId]);

  const activeCategory = useMemo<ServiceCategory | undefined>(
    () =>
      servicesData.categories.find(
        (category) => category.id === activeCategoryId
      ),
    [activeCategoryId, servicesData.categories]
  );

  return (
    <>
      <section className="flex flex-col gap-4 2xl:gap-10 -mt-4">
        <div
          className="-mx-6 px-6 flex flex-row flex-nowrap min-h-15 h-fit justify-start items-start xl:gap-4 gap-2 overflow-x-auto overflow-y-visible xl:overflow-x-visible"
          style={{ scrollbarWidth: "none" }}
        >
          {servicesData.categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setActiveCategoryId(category.id)}
              className="text-sm 2xl:text-2xl font-['PT_Sans'] rounded h-full"
            >
              <FlipButton className="rounded-sm">
                <FlipButtonFront
                  className={`text-nowrap p-3 w-full 2xl:text-2xl h-full shadow-none rounded-sm bg-white ${
                    activeCategoryId === category.id
                      ? "bg-[#4D4E69] border-1 border-[#4D4E69] text-white font-[600]"
                      : "bg-white text-black border-1 border-[#EBEBEB]"
                  }`}
                >
                  {category.label || "Unnamed"}
                </FlipButtonFront>
                <FlipButtonBack className="text-nowrap 2xl:text-2xl rounded-sm p-3 shadow-none border-1 bg-white border-[#4D4E69] text-black w-full h-full">
                  {category.label || "Unnamed"}
                </FlipButtonBack>
              </FlipButton>
            </div>
          ))}
        </div>
        <ul className="flex flex-col gap-3 mb-6">
          {activeCategory?.items?.length ? (
            activeCategory.items.map((service, index) => (
              <li
                key={`service-${activeCategory?.id ?? "category"}-${index}`}
                className="flex flex-row items-center gap-4 text-sm 2xl:text-lg font-normal text-[#4E4E4E]"
              >
                <CheckIcon />
                <span>{service}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-neutral-500">
              No services available for this category.
            </li>
          )}
        </ul>
        <div className="flex flex-row bg-[#D6D9E033] justify-center 2xl:w-full gap-4 p-4">
          {servicesData.leaderImageUrl ? (
            <Image
              src={servicesData.leaderImageUrl}
              width={1000}
              height={1000}
              alt={
                servicesData.leaderName
                  ? `${servicesData.leaderName} portrait`
                  : "Team portrait"
              }
              className="rounded saturate-10 w-[60px] h-[60px] 2xl:w-[108px] 2xl:h-[108px] object-cover aspect-square"
            />
          ) : (
            <div className="w-[60px] h-[60px] rounded bg-neutral-200" />
          )}

          <div className="flex flex-col justify-center gap-5 w-full">
            <span className="text-sm 2xl:text-2xl font-bold text-[#373737]">
              Our team develops fire protection systems built for precision,
              performance, and approval.
            </span>
            {servicesData.leaderName ? (
              <span className="text-xs 2xl:text-base text-[#4E4E4E] mt-1">
                {servicesData.leaderName}, Founder
              </span>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
