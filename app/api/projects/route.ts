import { NextResponse } from "next/server";
import { getProjects } from "@/lib/sanity/projects";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json(
      { projects: [], error: "Failed to load projects" },
      { status: 500 }
    );
  }
}
