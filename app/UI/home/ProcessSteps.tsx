export default function ProcessSteps() {
  return (
    <section className="w-full items-start px-5 xl:px-16 max-w-5xl mx-auto flex flex-col gap-8  font-['PT_Sans']">
      <div className="relative flex flex-col pr-5 xl:pr-8 pl-4 2xl:pl-15 text-[#4E4E4E] text-xs font-normal gap-2 leading-none ">
        <span className="text-[#4D4E69] text-sm 2xl:text-3xl font-bold font-['PT_Sans']">
          Assess & Strategize
        </span>
        <p className="text-xs 2xl:text-base">
          We start by understanding your project scope and identifying fire
          risks. Then, we craft a custom compliance strategy tailored to local
          codes, occupancy type, and performance goals.
        </p>
        <div className="flex flex-col items-center justify-center absolute -bottom-13 -left-5 w-10 h-10 2xl:w-14 2xl:h-14 bg-[#629199] text-white rounded-md">
          <span className="2xl:text-xl">1</span>
        </div>
      </div>
      <div className="border-t-2 border-[#999FB6] gap-8">
        <div className=" relative border-r-2 border-b-2 border-[#999FB6] flex flex-col items-start justify-center py-10 pr-8 pl-8 xl:pl-16 text-[#4E4E4E] text-xs font-normal font-['Inter'] gap-2 leading-none ">
          <span className="text-[#4D4E69] text-sm 2xl:text-3xl font-bold font-['PT_Sans']">
            Engineer & Design
          </span>

          <p className="text-xs 2xl:text-base font-['PT_Sans']">
            Our team develops precise fire protection system designs, from
            suppression and alarms to special hazards, all engineered for
            safety, efficiency, and code approval.
          </p>
          <div className="flex flex-col items-center justify-center absolute bottom-18 xl:bottom-16 -right-5 w-10 h-10 2xl:w-14 2xl:h-14 bg-[#629199] text-white rounded-md">
            <span className="2xl:text-xl">2</span>
          </div>
        </div>
        <div className="relative flex flex-col border-l-2 border-b-2 border-[#999FB6] items-start justify-center py-10 pl-8 pr-12 xl:pr-30 2xl:pl-15 text-[#4E4E4E] text-xs font-normal font-['Inter'] gap-2 leading-none ">
          <span className="text-[#4D4E69] text-sm 2xl:text-3xl font-bold font-['PT_Sans']">
            Document & Coordinate
          </span>
          <p className="text-xs 2xl:text-base font-['PT_Sans']">
            We create detailed drawings, fabrication lists, and submittals, then
            align closely with your architects, MEPs, and contractors to ensure
            seamless integration.
          </p>
          <div className="flex flex-col items-center justify-center absolute bottom-20 xl:bottom-18 -left-5 w-10 h-10 2xl:w-14 2xl:h-14 bg-[#629199] text-white rounded-md">
            <span className="2xl:text-xl">3</span>
          </div>
        </div>
        <div className="relative flex flex-col border-r-2 border-b-2 border-[#999FB6] items-start justify-center py-10 pr-8 pl-8 xl:pl-16 text-[#4E4E4E] text-xs font-normal font-['Inter'] gap-2 leading-none ">
          <span className="text-[#4D4E69] text-sm 2xl:text-3xl font-bold font-['PT_Sans']">
            Oversee & Review
          </span>
          <p className="text-xs 2xl:text-base font-['PT_Sans']">
            During installation, we’re on-site and on-call, reviewing progress,
            resolving issues, and ensuring systems are installed exactly as
            designed.
          </p>
          <div className="flex flex-col items-center justify-center absolute  bottom-16 xl:bottom-14 -right-5 w-10 h-10 2xl:w-14 2xl:h-14 bg-[#629199] text-white rounded-md">
            <span className="2xl:text-xl">4</span>
          </div>
        </div>
        <div className="relative flex flex-col border-l-2 border-[#999FB6] items-start justify-center py-10 pb-19 pl-8 pr-12 xl:pr-30 2xl:pl-15 text-[#4E4E4E] text-xs font-normal font-['Inter'] gap-2 leading-none ">
          <span className="text-[#4D4E69] text-sm 2xl:text-3xl font-bold font-['PT_Sans']">
            Test & Deliver
          </span>
          <p className="text-xs 2xl:text-base font-['PT_Sans']">
            We guide you through system testing, AHJ acceptance, and final
            approvals, closing the loop with as-builts and support for long-term
            reliability.
          </p>
          <div className="flex flex-col items-center justify-center absolute bottom-#0 xl:bottom-27 -left-5 w-10 h-10 2xl:w-14 2xl:h-14 bg-[#629199] text-white rounded-md">
            <span className="2xl:text-xl">5</span>
          </div>
        </div>
      </div>
    </section>
  );
}
