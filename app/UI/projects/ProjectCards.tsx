import Image from "next/image";

export default function ProjectCard({
  image,
  title,
  description,
  origin,
}: {
  title: string;
  image: string | undefined;
  description: string | undefined;
  origin: string;
}) {
  return (
    <article
      // key={key}
      className="project-item group bg-[#F3F7F7] hover:bg-neutral-200/50 transition-all duration-200 rounded flex flex-col xl:flex-row p-4 2xl:p-6 gap-4 2xl:gap-10 w-ull"
    >
      <Image
        src={image || "/images/fallback-image.png"}
        alt={title}
        width={1000}
        height={1000}
        className="rounded saturate-10 object-cover w-full xl:w-[134px] h-[134px] 2xl:w-[225px] 2xl:h-[225px]"
      />

      <div className="flex flex-col justify-between gap-[10.5px] w-full">
        <div className="flex flex-col gap-3 2xl:gap-4">
          <h2 className="text-[#2B4A4F] text-base 2xl:text-3xl font-bold font-['PT_Sans'] line-clamp-1">
            {title}
          </h2>
          <p className="text-[#4E4E4E] text-xs 2xl:text-xl font-normal line-clamp-3">
            {description}
          </p>
        </div>
        <div className="flex flex-row w-full justify-between items-center">
          <p className="text-[#4E4E4E] text-sm 2xl:text-lg font-normal">
            {origin}
          </p>
          <button className="group-hover:px-7 bg-[#232733] p-2 2xl:p-3 rounded-sm transition-all duration-200">
            <svg
              className="w-4 h-4 2xl:w-6 2xl:h-6"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
