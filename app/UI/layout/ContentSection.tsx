"use client";
import React, { ReactNode } from "react";

function ContentSection({ children }: { children?: ReactNode }) {
  return (
    <section
      className="z-10 bg-white flex flex-col gap-12 mt-20 xl:mt-0 border-[#646464] border-2 w-full xl:w-[650px] 2xl:w-[1126px] p-6 xl:p-16 h-full overflow-y-auto overflow-x-hidden"
      style={{ scrollbarWidth: "none" }}
    >
      {children}
    </section>
  );
}

export default ContentSection;
