import { Suspense } from "react";
import { notFound } from "next/navigation";
import ContentHeader from "@/app/UI/layout/ContentHeader";
import ContentSection from "@/app/UI/layout/ContentSection";
import Motion from "@/app/UI/layout/MotionContainer";
import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug } from "@/lib/sanity/projects";
import { ProjectDetailSkeleton } from "@/app/UI/projects/ProjectDetailSkeleton";
import { RichPortableText } from "@/app/UI/components/RichPortableText";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const description =
    project.description ||
    "Explore the details of our project work at ForgeWrite.";

  return {
    title: `${project.title || "Project"} | ForgeWrite`,
    description: description,
  };
}

async function ProjectDetail({ slug }: { slug: string }) {
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const imageSrc = project.imageUrl || "/images/fallback-image.png";
  const extraDetail = [
    project.title,
    project.location,
    project.finishedAt,
  ].filter(Boolean);

  return (
    <>
      <ContentSection>
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 w-fit">
            <Link
              className="w-fit"
              href="/projects"
              aria-label="Back to projects"
            >
              <svg
                className="w-8 h-8 2xl:w-12 2xl:h-12"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_460_3092"
                  maskUnits="userSpaceOnUse"
                  x="4"
                  y="4"
                  width="24"
                  height="24"
                >
                  <rect x="4" y="4" width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_460_3092)">
                  <path
                    d="M11.825 17L17.425 22.6L16 24L8 16L16 8L17.425 9.4L11.825 15H24V17H11.825Z"
                    fill="#929292"
                  />
                </g>
              </svg>
            </Link>
            <ContentHeader title={project.title || "Project"} />
          </div>

          {imageSrc ? (
            <Image
              src={imageSrc}
              width={1440}
              height={900}
              alt={project.title || "Project image"}
              className="w-full rounded-sm object-cover saturate-10"
              priority
            />
          ) : null}

          {project.content && (
            <RichPortableText
              value={project.content}
              className="text-[#4E4E4E]"
            />
          )}
        </section>
      </ContentSection>

      <div className="border-t-2 border-b-2 border-[#646464] hidden xl:block">
        <Motion>
          <div className="flex flex-col justify-between h-full w-full ">
            <div className="mt-16 ml-10 flex flex-col gap-4">
              {extraDetail.length > 0 ? (
                extraDetail.map((item, index) => (
                  <span
                    key={`extra-detail-${index}`}
                    className="hover:bg-neutral-100 transition-all duration-200 p-3 border border-[#4D4E69] rounded-sm text-[#4D4E69] w-fit"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-neutral-400">
                  No additional notes.
                </span>
              )}
            </div>
            <Image
              className="m-4 object-contain w-fit"
              src={"/images/3d-illustration-building-project_269358100.jpg"}
              height={400}
              width={300}
              alt="image"
            />
          </div>
        </Motion>
      </div>
    </>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug?.trim()) {
    notFound();
  }

  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetail slug={slug} />
    </Suspense>
  );
}
