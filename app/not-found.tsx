import React from "react";

export default function PageNotFound() {
  return (
    <section
      className={`w-full xl:w-[1005px] border-2 xl:border-r-0 border-[#646464] h-full flex flex-col gap-9 p-6 xl:pl-16 pt-60 xl:pt-30 bg-white`}
    >
      <span className="text-8xl xl:text-9xl text-[#999FB6] font-bold font-['PT_Sans']">
        404
      </span>
      <div className="flex flex-col gap-2">
        <span className="text-lg xl:text-2xl font-bold">Not Found</span>
        <span className="text-xs font-normal text-[#4E4E4E]">
          The resource reguested could not be found on the server.
        </span>
      </div>
    </section>
  );
}
