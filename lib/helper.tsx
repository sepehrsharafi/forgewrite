"use client";
import { useMemo } from "react";
import { useSanityData } from "@/utils/sanityClient";
import type { PortableTextBlock, PortableTextSpan } from "@/utils/sanityTypes";

export function blocksToText(content?: PortableTextBlock[]): string {
  if (!Array.isArray(content)) return "";
  try {
    return content
      .map((b: PortableTextBlock) =>
        Array.isArray(b?.children)
          ? b.children
              .map((c: PortableTextSpan) => c?.text ?? "")
              .join("")
          : ""
      )
      .filter(Boolean)
      .join("\n\n");
  } catch {
    return "";
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  const { projects } = useSanityData();
  const project = useMemo(
    () => projects.find((p) => p.slug === params.slug),
    [projects, params.slug]
  );
  const body = useMemo(() => blocksToText(project?.content), [project]);
  console.log(project);
  return (
    <pre className="p-4 whitespace-pre-wrap text-sm">
      {body || "No content"}
    </pre>
  );
}
