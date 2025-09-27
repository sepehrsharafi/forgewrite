import MyLottieComponent from "@/lib/LottieMotion";
import Motion from "../layout/MotionContainer";

export default function ServicesSkeleton() {
  const motionMap: Record<string, string> = {
    engineers: "/motion/Map 1.json",
    fieldSupport: "/motion/Map 2.json",
    officeManagers: "/motion/Map 3.json",
  };
  const motionLocation = motionMap[0];
  return (
    <>
      <section className="z-10 bg-white flex flex-col gap-6 w-full xl:w-full overflow-clip animate-pulse">
        <div className="space-y-3">
          <div className="h-10 w-2/3 rounded bg-neutral-200" />
          <div className="h-4 w-full rounded bg-neutral-200" />
          <div className="h-4 w-5/6 rounded bg-neutral-200" />
        </div>

        <div className="flex flex-row gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`button-skeleton-${index}`}
              className="h-10 w-32 rounded bg-neutral-200"
            />
          ))}
        </div>

        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`service-skeleton-${index}`}
              className="h-5 w-full rounded bg-neutral-200"
            />
          ))}
        </div>

        <div className="flex flex-row items-center gap-4 bg-[#D6D9E033] p-4">
          <div className="w-[60px] h-[60px] rounded bg-neutral-200" />
          <div className="flex flex-col gap-2 w-full max-w-[450px]">
            <div className="h-4 w-3/4 rounded bg-neutral-200" />
            <div className="h-3 w-1/3 rounded bg-neutral-200" />
          </div>
        </div>
      </section>
    </>
  );
}
