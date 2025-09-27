import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Card({
  title,
  description,
  imageURL,
  slug,
}: {
  title: string;
  description: string;
  imageURL: string;
  slug: string;
}) {
  return (
    <Link href={`/insights/${slug}`}>
      <article className="flex flex-col gap-3 h-full justify-between group">
        <div className="flex flex-col gap-3">
          <Image
            src={imageURL}
            alt={title || "insight"}
            width={1000}
            height={1000}
            className="w-full h-32 2xl:h-[200px] rounded-sm saturate-10 object-cover"
          />

          <div className="flex flex-col gap-2">
            <h2 className="text-base 2xl:text-xl font-bold font-['PT_Sans']">
              {title}
            </h2>
            <p className="text-xs 2xl:text-base text-[#3A646B] line-clamp-2">
              {description}
            </p>
          </div>
        </div>
        <button className=" cursor-pointer bg-[#4D838C] rounded-sm p-1 2xl:p-3 w-fit group-hover:px-4 2xl:group-hover:px-8 transition-all duration-200 ease-in-out group-hover:bg-[#3f6d75]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_812_254"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="24"
            >
              <rect width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_812_254)">
              <path
                d="M16.175 13H4V11H16.175L10.575 5.4L12 4L20 12L12 20L10.575 18.6L16.175 13Z"
                fill="white"
              />
            </g>
          </svg>
        </button>
      </article>
    </Link>
  );
}
