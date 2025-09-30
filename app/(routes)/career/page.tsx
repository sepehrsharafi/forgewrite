import ContentHeader from "@/app/UI/layout/ContentHeader";
import ContentSection from "@/app/UI/layout/ContentSection";
import Motion from "@/app/UI/layout/MotionContainer";
import RiveAnimation from "@/app/UI/layout/rivecomponent";
import MyLottieComponent from "@/lib/LottieMotion";
import { FlipButton, FlipButtonFront } from "@/app/UI/components/buttons/flip";
import { FlipButtonBack } from "@/app/UI/components/animate-ui/primitives/buttons/flip";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { getCareers, type CareerRecord } from "@/lib/sanity/careers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Our Team | Forgewrite ",
  description:
    "Explore career opportunities at Forgewrite. We're looking for talented individuals to join our mission-driven team. View our current openings and learn about our culture.",
};

interface ArticleProps {
  svg: ReactNode;
  text: string;
}

function CareerListSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-row items-center justify-between bg-[#F3F7F7] p-3"
        >
          <span className="h-5 w-32 rounded bg-gray-200" />
          <div className="flex flex-row items-center gap-2 text-[#4E4E4E] text-sm font-normal">
            <span className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-4 w-4 rounded-full bg-gray-200" />
            <span className="h-4 w-16 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Article({ svg, text }: ArticleProps) {
  return (
    <article className="flex flex-row items-center gap-4 ">
      <span className="w-10 h-10">{svg}</span>
      <p className="text-[#4E4E4E] text-sm 2xl:text-xl">{text}</p>
    </article>
  );
}

function Careers({ careers: jobs }: { careers: CareerRecord[] }) {
  return (
    <>
      <div className="flex flex-col gap-4 -my-6">
        {jobs.length > 0 ? (
          jobs.map((job, idx) => (
            <Link
              href={job.link}
              key={`${job.slug || idx}`}
              className="flex flex-row justify-between items-center bg-[#F3F7F7] hover:bg-[#efefefd2] transition-all duration-200 p-3 2xl:py-4 2xl:px-8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className=" text-[#2B4A4F] text-base 2xl:text-xl font-bold ">
                {job.title || "Untitled Role"}
              </span>
              <div className="flex flex-row items-center gap-2 2xl:gap-4 text-[#4E4E4E]">
                <span className="text-base  2xl:text-lg font-normal">
                  {job.workLocation || "Remote"}
                </span>
                <svg
                  width="8"
                  height="9"
                  viewBox="0 0 8 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="4" cy="4.5" r="4" fill="#D9D9D9" />
                </svg>
                <span className="text-sm 2xl:text-lg font-normal">
                  {job.employmentType?.replaceAll("_", " ") || "Full time"}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-[#4E4E4E]">
            No openings are listed right now. Reach out through our contact form
            to connect with the team.
          </p>
        )}
      </div>
      <Link className="block xl:hidden w-full" href={"./contact-us"}>
        <FlipButton className="w-full">
          <FlipButtonFront className="2xl:text-base shadow-none py-3 px-4 bg-white text-black  w-full h-full  border-2 border-[#EBEBEB]">
            Contact Us
          </FlipButtonFront>
          <FlipButtonBack className="py-3 px-4 bg-[#4D838C] w-full h-full text-white rounded-md">
            Contact Us
          </FlipButtonBack>
        </FlipButton>
      </Link>
    </>
  );
}

async function CareersDataContainer() {
  const careers = await getCareers();

  if (!careers) {
    return null;
  }

  return <Careers careers={careers} />;
}

function Page() {
  return (
    <>
      <ContentSection>
        <div className="block xl:hidden -mx-6 -mt-6">
          <Motion>
            <MyLottieComponent
              motionLocation={"/motion/Mobile-responsive/M-Career.json"}
            />
          </Motion>
        </div>
        <ContentHeader
          title="Career"
          description="Our company is always looking for professional and inspired people who are ready to work, according to our principles and standards. Look through the list of our advantages to see what you get by becoming a part of our team."
        />
        <div className="flex flex-col gap-6">
          <Article
            svg={
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 6H22V19.75M11 33.5H22V19.75M22 19.75H11M22 19.75H35M35 19.75L31 15.75M35 19.75L31 24"
                  stroke="#A0BDC2"
                  strokeWidth="3"
                />
                <rect
                  x="5.5"
                  y="2.5"
                  width="7"
                  height="7"
                  fill="#A0BDC2"
                  stroke="#A0BDC2"
                />
                <rect
                  x="5.5"
                  y="15.5"
                  width="7"
                  height="7"
                  fill="#A0BDC2"
                  stroke="#A0BDC2"
                />
                <rect
                  x="5.5"
                  y="30.5"
                  width="7"
                  height="7"
                  fill="#A0BDC2"
                  stroke="#A0BDC2"
                />
              </svg>
            }
            text="Work on meaningful, high-impact projects across the country."
          />
          <Article
            svg={
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="6.5"
                  cy="18.5"
                  r="3"
                  fill="#A0BDC2"
                  stroke="#A0BDC2"
                />
                <circle
                  cx="33.5"
                  cy="18.5"
                  r="3"
                  fill="#A0BDC2"
                  stroke="#A0BDC2"
                />
                <circle
                  cx="20"
                  cy="15"
                  r="4.5"
                  fill="#A0BDC2"
                  stroke="#A0BDC2"
                />
                <path
                  d="M12 22.5H28C28.2761 22.5 28.5 22.7239 28.5 23V28.5H11.5V23C11.5 22.7239 11.7239 22.5 12 22.5Z"
                  stroke="#A0BDC2"
                  strokeWidth="3"
                />
                <path
                  d="M38 24.5C38.2761 24.5 38.5 24.7239 38.5 25V28.5H32.5V24.5H38Z"
                  fill="#A0BDC2"
                  stroke="#A0BDC2"
                  strokeWidth="3"
                />
                <path
                  d="M2 24.5H7.5V28.5H1.5V25C1.5 24.7239 1.72386 24.5 2 24.5Z"
                  fill="#A0BDC2"
                  stroke="#A0BDC2"
                  strokeWidth="3"
                />
              </svg>
            }
            text="Grow under experienced leadership rooted in three generations of engineering"
          />
          <Article
            svg={
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_56_1773"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                >
                  <rect width="40" height="40" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_56_1773)">
                  <path
                    d="M19.7921 33.3333C19.9032 33.3333 20.0143 33.3056 20.1254 33.25C20.2365 33.1945 20.3198 33.1389 20.3754 33.0833L34.0421 19.4167C34.3754 19.0833 34.6185 18.7083 34.7712 18.2917C34.924 17.875 35.0004 17.4583 35.0004 17.0417C35.0004 16.5972 34.924 16.1736 34.7712 15.7708C34.6185 15.3681 34.3754 15.0139 34.0421 14.7083L26.9587 7.62501C26.6532 7.29168 26.299 7.04862 25.8962 6.89584C25.4934 6.74307 25.0698 6.66668 24.6254 6.66668C24.2087 6.66668 23.7921 6.74307 23.3754 6.89584C22.9587 7.04862 22.5837 7.29168 22.2504 7.62501L21.7921 8.08334L24.8754 11.2083C25.2921 11.5972 25.5976 12.0417 25.7921 12.5417C25.9865 13.0417 26.0837 13.5695 26.0837 14.125C26.0837 15.2917 25.6879 16.2708 24.8962 17.0625C24.1046 17.8542 23.1254 18.25 21.9587 18.25C21.4032 18.25 20.8684 18.1528 20.3546 17.9583C19.8407 17.7639 19.3893 17.4722 19.0004 17.0833L15.8754 14L8.58372 21.2917C8.50039 21.375 8.43789 21.4653 8.39622 21.5625C8.35456 21.6597 8.33372 21.7639 8.33372 21.875C8.33372 22.0972 8.41706 22.2986 8.58372 22.4792C8.75039 22.6597 8.94484 22.75 9.16706 22.75C9.27817 22.75 9.38928 22.7222 9.50039 22.6667C9.6115 22.6111 9.69484 22.5556 9.75039 22.5L15.4171 16.8333L17.7504 19.1667L12.1254 24.8333C12.0421 24.9167 11.9796 25.007 11.9379 25.1042C11.8962 25.2014 11.8754 25.3056 11.8754 25.4167C11.8754 25.6389 11.9587 25.8333 12.1254 26C12.2921 26.1667 12.4865 26.25 12.7087 26.25C12.8198 26.25 12.9309 26.2222 13.0421 26.1667C13.1532 26.1111 13.2365 26.0556 13.2921 26L18.9587 20.375L21.2921 22.7083L15.6671 28.375C15.5837 28.4306 15.5212 28.5139 15.4796 28.625C15.4379 28.7361 15.4171 28.8472 15.4171 28.9583C15.4171 29.1806 15.5004 29.375 15.6671 29.5417C15.8337 29.7083 16.0282 29.7917 16.2504 29.7917C16.3615 29.7917 16.4657 29.7708 16.5629 29.7292C16.6601 29.6875 16.7504 29.625 16.8337 29.5417L22.5004 23.9167L24.8337 26.25L19.1671 31.9167C19.0837 32 19.0212 32.0903 18.9796 32.1875C18.9379 32.2847 18.9171 32.3889 18.9171 32.5C18.9171 32.7222 19.0073 32.9167 19.1879 33.0833C19.3684 33.25 19.5698 33.3333 19.7921 33.3333ZM19.7504 36.6667C18.7226 36.6667 17.8129 36.3264 17.0212 35.6458C16.2296 34.9653 15.7643 34.1111 15.6254 33.0833C14.6809 32.9445 13.8893 32.5556 13.2504 31.9167C12.6115 31.2778 12.2226 30.4861 12.0837 29.5417C11.1393 29.4028 10.3546 29.007 9.72956 28.3542C9.10456 27.7014 8.72261 26.9167 8.58372 26C7.52817 25.8611 6.66706 25.4028 6.00039 24.625C5.33372 23.8472 5.00039 22.9306 5.00039 21.875C5.00039 21.3195 5.10456 20.7847 5.31289 20.2708C5.52122 19.757 5.81984 19.3056 6.20872 18.9167L15.8754 9.29168L21.3337 14.75C21.3893 14.8333 21.4726 14.8958 21.5837 14.9375C21.6948 14.9792 21.8059 15 21.9171 15C22.1671 15 22.3754 14.9236 22.5421 14.7708C22.7087 14.6181 22.7921 14.4167 22.7921 14.1667C22.7921 14.0556 22.7712 13.9445 22.7296 13.8333C22.6879 13.7222 22.6254 13.6389 22.5421 13.5833L16.5837 7.62501C16.2782 7.29168 15.924 7.04862 15.5212 6.89584C15.1184 6.74307 14.6948 6.66668 14.2504 6.66668C13.8337 6.66668 13.4171 6.74307 13.0004 6.89584C12.5837 7.04862 12.2087 7.29168 11.8754 7.62501L6.00039 13.5417C5.75039 13.7917 5.54206 14.0833 5.37539 14.4167C5.20872 14.75 5.09761 15.0833 5.04206 15.4167C4.9865 15.75 4.9865 16.0903 5.04206 16.4375C5.09761 16.7847 5.20872 17.1111 5.37539 17.4167L2.95872 19.8333C2.4865 19.1945 2.13928 18.4931 1.91706 17.7292C1.69484 16.9653 1.6115 16.1945 1.66706 15.4167C1.72261 14.6389 1.91706 13.882 2.25039 13.1458C2.58372 12.4097 3.04206 11.75 3.62539 11.1667L9.50039 5.29168C10.1671 4.65279 10.9101 4.16668 11.7296 3.83334C12.549 3.50001 13.3893 3.33334 14.2504 3.33334C15.1115 3.33334 15.9518 3.50001 16.7712 3.83334C17.5907 4.16668 18.3198 4.65279 18.9587 5.29168L19.4171 5.75001L19.8754 5.29168C20.5421 4.65279 21.2851 4.16668 22.1046 3.83334C22.924 3.50001 23.7643 3.33334 24.6254 3.33334C25.4865 3.33334 26.3268 3.50001 27.1462 3.83334C27.9657 4.16668 28.6948 4.65279 29.3337 5.29168L36.3754 12.3333C37.0143 12.9722 37.5004 13.7083 37.8337 14.5417C38.1671 15.375 38.3337 16.2222 38.3337 17.0833C38.3337 17.9445 38.1671 18.7847 37.8337 19.6042C37.5004 20.4236 37.0143 21.1528 36.3754 21.7917L22.7087 35.4167C22.3198 35.8056 21.8684 36.1111 21.3546 36.3333C20.8407 36.5556 20.3059 36.6667 19.7504 36.6667Z"
                    fill="#A0BDC2"
                  />
                </g>
              </svg>
            }
            text="Be part of a mission-driven team that values both technical mastery and human connection"
          />
          <Article
            svg={
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_56_1776"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                >
                  <rect width="40" height="40" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_56_1776)">
                  <path
                    d="M13.3333 22.75V10H18.3333V22.75L15.8333 20.4167L13.3333 22.75ZM21.6667 25.25V3.33334H26.6667V20.25L21.6667 25.25ZM5 31V16.6667H10V26L5 31ZM5 35.0833L15.75 24.3333L21.6667 29.4167L31 20.0833H28.3333V16.75H36.6667V25.0833H33.3333V22.4167L21.8333 33.9167L15.9167 28.8333L9.66667 35.0833H5Z"
                    fill="#A0BDC2"
                  />
                </g>
              </svg>
            }
            text="Enjoy a culture that values life outside the office as much as life inside it"
          />
        </div>
        <div className="flex flex-row w-full items-center justify-between">
          <ContentHeader
            title="Current Opportunities"
            description="We`re always on the lookout for:"
          />
          <Link className="hidden xl:block" href={"./contact-us"}>
            <FlipButton>
              <FlipButtonFront className="2xl:text-base shadow-none py-3 px-4 bg-white text-black  w-full h-full  border-2 border-[#EBEBEB]">
                Contact Us
              </FlipButtonFront>
              <FlipButtonBack className="2xl:text-base py-3 px-4 bg-[#4D838C] w-full h-full text-white rounded-md">
                Contact Us
              </FlipButtonBack>
            </FlipButton>
          </Link>
        </div>
        <Suspense fallback={<CareerListSkeleton />}>
          <CareersDataContainer />
        </Suspense>
      </ContentSection>
      <div className="border-b-2 border-t-2 border-[#646464]  hidden xl:block ">
        <Motion>
          <RiveAnimation src="/motion/forgewrite_-_career_page_.riv" />
        </Motion>
      </div>
    </>
  );
}

export default Page;
