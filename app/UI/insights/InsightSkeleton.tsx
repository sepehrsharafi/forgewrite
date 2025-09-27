import ContentSection from "@/app/UI/layout/ContentSection";
import Motion from "@/app/UI/layout/MotionContainer";

export function InsightDetailSkeleton() {
  return (
    <>
      <ContentSection>
        <section className="flex flex-col gap-6 animate-pulse">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-8 rounded bg-neutral-200" />
            <div className="h-10 w-3/4 rounded bg-neutral-200" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-11/12 rounded bg-neutral-200" />
            <div className="h-4 w-2/3 rounded bg-neutral-200" />
          </div>
        </section>
      </ContentSection>

      <div className="border-t-2 border-b-2 border-[#646464] hidden xl:block">
        <Motion>
          <div className="h-full w-full bg-neutral-200 animate-pulse" />
        </Motion>
      </div>
    </>
  );
}
