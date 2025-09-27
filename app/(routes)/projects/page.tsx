import { Suspense } from "react";
import ContentHeader from "@/app/UI/layout/ContentHeader";
import ContentSection from "@/app/UI/layout/ContentSection";
import ProjectCard from "@/app/UI/projects/ProjectCards";
import ProjectCardSkeleton from "@/app/UI/projects/ProjectCardSkeleton";
import Motion from "@/app/UI/layout/MotionContainer";
import Link from "next/link";
import MyLottieComponent from "@/lib/LottieMotion";
import { getProjects, type ProjectRecord } from "@/lib/sanity/projects";
import RiveAnimation from "@/app/UI/layout/rivecomponent";

async function ProjectsList() {
  try {
    const projects = await getProjects();

    if (projects.length === 0) {
      return <p className="text-sm text-neutral-500">No projects available.</p>;
    }

    return (
      <div className="flex flex-col gap-6">
        {projects.map((project: ProjectRecord, index) => (
          <Link key={project.slug || index} href={`/projects/${project.slug}`}>
            <ProjectCard
              image={project.imageUrl || "/images/fallback-image.png"}
              title={project.title}
              description={project.description}
              origin={project.location ?? ""}
            />
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.log(error);
    return (
      <p className="text-sm text-red-500">
        Failed to load projects. Please try again later.
      </p>
    );
  }
}

export default function Page() {
  return (
    <>
      <ContentSection>
        <div className="block xl:hidden -mt-5 -mx-6">
          <Motion className="py-2">
            <MyLottieComponent
              motionLocation={"/motion/Mobile-responsive/M-Projects.json"}
            />
          </Motion>
        </div>
        <ContentHeader
          title={"Real Projects. Proven Solutions."}
          description={`Each project snapshot includes a summary of the challenge, the approach we took, and the results we delivered, all rooted in precision, compliance, and legacy.`}
        />
        <Suspense
          fallback={
            <div className="flex flex-col gap-6">
              {Array.from({ length: 2 }).map((_, index) => (
                <ProjectCardSkeleton key={index} />
              ))}
            </div>
          }
        >
          <ProjectsList />
        </Suspense>
      </ContentSection>
      <div className=" border-b-2 border-t-2 border-[#646464] hidden xl:block ">
        <Motion>
          <RiveAnimation src="/motion/forgewrite_-_projects_page_.riv" />
        </Motion>
      </div>
    </>
  );
}
