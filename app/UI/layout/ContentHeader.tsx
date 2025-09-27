export default function ContentHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <>
      <div className="flex flex-col gap-2 2xl:gap-8">
        <h1 className="font-['PT_Sans'] font-bold xl:text-[32px] text-[#4D4E69] text-3xl 2xl:text-4xl">
          {title}
        </h1>
        <h2
          className={`text-sm 2xl:text-2xl font-medium text-[#4E4E4E] ${
            description ? "block" : "hidden"
          }`}
        >
          {description}
        </h2>
      </div>
    </>
  );
}
