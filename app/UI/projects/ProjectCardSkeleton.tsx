import React from "react";

export default function ProjectCardSkeleton() {
  return (
    <article className="project-item bg-[#F3F7F7] rounded flex flex-col xl:flex-row p-4 gap-4 w-ull ">
      <div className="rounded w-full h-[134px] xl:w-[134px] xl:h-[134px] skeleton" />
      <div className="flex flex-col gap-[10.5px] w-full">
        <div className="h-4 w-1/2 skeleton rounded" />
        <div className="h-3 w-11/12 skeleton rounded" />
        <div className="h-3 w-3/4 skeleton rounded" />
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="h-3 w-24 skeleton rounded" />
          <div className="h-8 w-8 skeleton rounded" />
        </div>
      </div>
    </article>
  );
}
