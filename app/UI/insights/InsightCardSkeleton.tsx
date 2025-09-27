import React from "react";

export default function InsightCardSkeleton() {
  return (
    <article className="flex flex-col gap-3">
      <div className="w-full h-32 2xl:h-48 rounded-sm skeleton" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-2/3 skeleton rounded" />
        <div className="h-3 w-11/12 skeleton rounded" />
      </div>
      <div className="bg-[#4D838C] rounded-sm p-1 w-6 h-6 2xl:h-10 2xl:w-10 skeleton" />
    </article>
  );
}
