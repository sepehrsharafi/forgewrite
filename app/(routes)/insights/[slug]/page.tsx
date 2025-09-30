import { Suspense } from "react";
import { notFound } from "next/navigation";
import ContentHeader from "@/app/UI/layout/ContentHeader";
import ContentSection from "@/app/UI/layout/ContentSection";
import Motion from "@/app/UI/layout/MotionContainer";
import Image from "next/image";
import Link from "next/link";
import { getInsightBySlug } from "@/lib/sanity/insights";
import { InsightDetailSkeleton } from "@/app/UI/insights/InsightSkeleton";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const insight = await getInsightBySlug(slug);

  if (!insight) {
    notFound();
  }

  return {
    title: `${insight.title || "Insight"} | ForgeWrite`,
    description:
      insight.description ||
      "Read more about this topic on ForgeWrite's insights page.",
  };
}
async function InsightDetail({ slug }: { slug: string }) {
  const insight = await getInsightBySlug(slug);

  if (!insight) {
    notFound();
  }

  return (
    <>
      <ContentSection>
        <div className="-m-6 block xl:hidden">
          <Motion>
            <Image
              src={insight.imageUrl || "/images/fallback-image.png"}
              width={1600}
              height={900}
              alt={insight.title || "Insight image"}
              className="w-full h-full object-cover saturate-10"
            />
          </Motion>
        </div>
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Link
              className="w-fit"
              href="/insights"
              aria-label="Back to insights"
            >
              <svg
                className="w-8 h-8 2xl:w-12 2xl:h-12"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_460_3092"
                  maskUnits="userSpaceOnUse"
                  x="4"
                  y="4"
                  width="24"
                  height="24"
                >
                  <rect x="4" y="4" width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_460_3092)">
                  <path
                    d="M11.825 17L17.425 22.6L16 24L8 16L16 8L17.425 9.4L11.825 15H24V17H11.825Z"
                    fill="#929292"
                  />
                </g>
              </svg>
            </Link>
            <ContentHeader title={insight.title || "Insight"} />
          </div>
          {insight.content && (
            <p className="text-[#4E4E4E] 2xl: 2xl:text-xl whitespace-pre-line text-base">
              {insight.content}
            </p>
          )}
        </section>
      </ContentSection>

      <div className="border-t-2 border-b-2 border-[#646464] hidden xl:block">
        <Motion>
          <Image
            src={insight.imageUrl || "/images/fallback-image.png"}
            width={1600}
            height={900}
            alt={insight.title || "Insight image"}
            className="w-full h-full object-cover saturate-10"
          />
        </Motion>
      </div>
    </>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const { slug: slugParam } = await params;

  const slug =
    typeof slugParam === "string"
      ? slugParam
      : Array.isArray(slugParam)
      ? slugParam[0]
      : "";

  if (!slug) {
    notFound();
  }

  return (
    <Suspense fallback={<InsightDetailSkeleton />}>
      <InsightDetail slug={slug} />
    </Suspense>
  );
}
