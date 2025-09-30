"use client";

import { useMemo } from "react";
import Image from "next/image";
import { FlipButton, FlipButtonFront } from "@/app/UI/components/buttons/flip";
import { FlipButtonBack } from "@/app/UI/components/animate-ui/primitives/buttons/flip";
import type {
  ServiceCategory,
  ServicesData,
} from "@/lib/sanity/types";

type ServicesViewProps = {
  servicesData: ServicesData;
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
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

export default function ServicesView({
  servicesData,
  activeCategoryId,
  onCategoryChange,
}: ServicesViewProps) {
  const activeCategory = useMemo<ServiceCategory | undefined>(
    () =>
      servicesData.categories.find(
        (category) => category.id === activeCategoryId
      ),
    [activeCategoryId, servicesData.categories]
  );

  return (
    <section className="flex flex-col gap-4 2xl:gap-10 -mt-4">
      <div
        className="-mx-6 px-6 flex flex-row flex-nowrap min-h-15 h-fit justify-start items-start xl:gap-4 gap-2 overflow-x-auto overflow-y-visible xl:overflow-x-visible"
        style={{ scrollbarWidth: "none" }}
      >
        {servicesData.categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className="text-sm 2xl:text-2xl font-['PT_Sans'] rounded h-full"
          >
            <FlipButton className="rounded-sm">
              <FlipButtonFront
                className={`text-nowrap p-3 w-full 2xl:text-2xl h-full shadow-none rounded-sm ${
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
          activeCategory.items.map((service: string, index: number) => (
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
  );
}
