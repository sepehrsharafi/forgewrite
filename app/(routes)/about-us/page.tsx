import type { Metadata } from "next";
import ContentHeader from "@/app/UI/layout/ContentHeader";
import ContentSection from "@/app/UI/layout/ContentSection";
import Motion from "@/app/UI/layout/MotionContainer";
import MyLottieComponent from "@/lib/LottieMotion";
import Image from "next/image";
import { Suspense } from "react";
import { getAboutPageData, type AboutPageRecord } from "@/lib/sanity/about";

export const metadata: Metadata = {
  title: "Forgewrite | Our Story, Mission, and Values",
  description:
    "Learn about Forgewrite's story, from our beginnings to our mission for the future. Discover our commitment to innovation, quality, and the people who make it all happen.",
};

function AboutSkeleton() {
  return (
    <div className="flex flex-col gap-12 animate-pulse ">
      <div className="space-y-4">
        <div className="h-10 w-2/3 rounded bg-gray-200" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-72 w-full rounded bg-gray-200" />
        <div className="flex flex-row items-start justify-between">
          <div className="h-5 w-32 rounded bg-gray-200" />
          <div className="flex flex-row items-center gap-2">
            <div className="h-4 w-12 rounded bg-gray-200" />
            <div className="h-4 w-4 rounded-full bg-gray-200" />
            <div className="h-4 w-28 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutusContent({ about }: { about: AboutPageRecord }) {
  return (
    <>
      <ContentHeader
        title="About the company"
        description={about.aboutCompany}
      />
      <div className="flex flex-col gap-3">
        <Image
          src={about.imageUrl}
          width={2000}
          height={1000}
          alt={about.name}
          className="w-full rounded saturate-10"
          priority
        />
        <div className="flex flex-row justify-between">
          <span className="text-lg 2xl:text-2xl font-bold text-[#1F1F1F]">
            {about.name}
          </span>
          <div className="flex flex-row items-center gap-2 text-base 2xl:text-xl font-light text-[#4E4E4E]">
            <span>CEO</span>
            <svg
              width="4"
              height="5"
              viewBox="0 0 4 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="2" cy="2.5" r="2" fill="#D4D4D4" />
            </svg>
            <span>{about.email}</span>
          </div>
        </div>
      </div>
    </>
  );
}

async function AboutDataContainer() {
  const aboutData = await getAboutPageData();

  if (!aboutData) {
    return null;
  }

  return <AboutusContent about={aboutData} />;
}

function Page() {
  return (
    <>
      <ContentSection>
        <div className="block xl:hidden -mx-6 -mt-6">
          <Motion>
            <MyLottieComponent
              motionLocation={"/motion/Mobile-responsive/M-About Us.json"}
            />
          </Motion>
        </div>
        <Suspense fallback={<AboutSkeleton />}>
          <AboutDataContainer />
        </Suspense>
      </ContentSection>
      <div className=" border-b-2 border-t-2 border-[#646464] hidden xl:block ">
        <Motion>
          <MyLottieComponent
            motionLocation={
              "/motion/Medium Desktop - responsive/D1-About Us.json"
            }
          />
        </Motion>
      </div>
    </>
  );
}

export default Page;
