import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/sanity/projects";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string | string[] }> }
) {
  try {
    const { slug: slugParam } = await params;
    const slug =
      typeof slugParam === "string"
        ? slugParam
        : Array.isArray(slugParam)
        ? slugParam[0]
        : "";

    if (!slug) {
      return NextResponse.json({ project: null }, { status: 404 });
    }

    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json({ project: null }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { project: null, error: "Failed to load project" },
      { status: 500 }
    );
  }
}
