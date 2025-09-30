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
import { RichPortableText } from "@/app/UI/components/RichPortableText";
import type { PortableRichTextBlock } from "@/app/UI/portableText";

function portableTextToPlainText(blocks?: PortableRichTextBlock[]): string {
  if (!Array.isArray(blocks)) {
    return "";
  }

  return blocks
    .map((block) => {
      if (!block || block._type !== "block") {
        return "";
      }

      const children =
        (block as { children?: Array<{ text?: string }> }).children ?? [];

      return children
        .map((child) => (typeof child?.text === "string" ? child.text : ""))
        .join("");
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);

  if (!insight) {
    notFound();
  }

  const plainText = portableTextToPlainText(insight.content);
  const fallbackDescription =
    insight.description?.trim() ||
    "Read more about this topic on ForgeWrite's insights page.";
  const descriptionSource = plainText || fallbackDescription;
  const description =
    descriptionSource.length > 160
      ? `${descriptionSource.slice(0, 157).trimEnd()}...`
      : descriptionSource;

  return {
    title: `${insight.title || "Insight"} | ForgeWrite`,
    description,
  };
}

async function InsightDetail({ slug }: { slug: string }) {
  const insight = await getInsightBySlug(slug);

  if (!insight) {
    notFound();
  }

  const contentBlocks = Array.isArray(insight.content) ? insight.content : [];
  const heroSrc = insight.imageUrl || "/images/fallback-image.png";

  return (
    <>
      <ContentSection>
        <div className="-m-6 block xl:hidden">
          <Motion>
            <Image
              src={heroSrc}
              width={1600}
              height={900}
              alt={insight.title || "Insight image"}
              className="h-full w-full object-cover saturate-10"
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
                className="h-8 w-8 2xl:h-12 2xl:w-12"
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
          {contentBlocks.length > 0 ? (
            <RichPortableText
              value={contentBlocks}
              className="text-[#4E4E4E]"
            />
          ) : (
            <p className="whitespace-pre-line text-base text-[#4E4E4E] 2xl:text-xl">
              {insight.description || "Details coming soon."}
            </p>
          )}
        </section>
      </ContentSection>

      <div className="hidden border-y-2 border-[#646464] xl:block">
        <Motion>
          <Image
            src={heroSrc}
            width={1600}
            height={900}
            alt={insight.title || "Insight image"}
            className="h-full w-full object-cover saturate-10"
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
