import { Suspense } from "react";
import ContentHeader from "@/app/UI/layout/ContentHeader";
import ContentSection from "@/app/UI/layout/ContentSection";
import Card from "@/app/UI/insights/Card";
import InsightCardSkeleton from "@/app/UI/insights/InsightCardSkeleton";
import Motion from "@/app/UI/layout/MotionContainer";
import InsightsMotion from "@/app/UI/insights/InsightsMotion";
import { type InsightRecord, getInsights } from "@/lib/sanity/insights";

// The skeleton for the cards grid
function InsightsSkeleton() {
  return (
    <>
      <InsightCardSkeleton />
      <InsightCardSkeleton />
      <InsightCardSkeleton />
    </>
  );
}

// An async component that awaits the promise and renders the cards
async function InsightsList({
  insightsPromise,
}: {
  insightsPromise: Promise<InsightRecord[]>;
}) {
  const insights = await insightsPromise;
  return (
    <>
      {insights.map((insight: InsightRecord, index: number) => (
        <Card
          key={`insight-${insight.slug || "item"}-${index}`}
          imageURL={insight.imageUrl || "/images/fallback-image.png"}
          title={insight.title}
          description={insight.description}
          slug={insight.slug}
        />
      ))}
    </>
  );
}

// An async component that awaits the promise and renders the motion headers
async function MotionHeaders({
  insightsPromise,
}: {
  insightsPromise: Promise<InsightRecord[]>;
}) {
  const insights = await insightsPromise;
  return (
    <InsightsMotion
      key={`insight-motion`}
      headers={insights.map((insight) => insight.title)}
    />
  );
}

export default function Page() {
  // Start fetching the data, which gives us a promise.
  // We don't await it here, so the component renders instantly.
  const insightsPromise = getInsights();

  return (
    <>
      <ContentSection>
        <div className=" block xl:hidden -mx-6 -mt-6">
          <Motion>
            {/* The MotionHeaders component will suspend while the data is fetching */}
            <Suspense
              fallback={null /* Or a specific skeleton for the motion bar */}
            >
              <MotionHeaders insightsPromise={insightsPromise} />
            </Suspense>
          </Motion>
        </div>
        <ContentHeader title="Insights" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* The InsightsList component will suspend, showing the skeleton fallback */}
          <Suspense fallback={<InsightsSkeleton />}>
            <InsightsList insightsPromise={insightsPromise} />
          </Suspense>
        </div>
      </ContentSection>
      <div className="border-b-2 border-t-2 border-[#646464] hidden xl:block ">
        <Motion>
          {/* The MotionHeaders component will suspend while the data is fetching */}
          <Suspense
            fallback={null /* Or a specific skeleton for the motion bar */}
          >
            <MotionHeaders insightsPromise={insightsPromise} />
          </Suspense>
        </Motion>
      </div>
    </>
  );
}
