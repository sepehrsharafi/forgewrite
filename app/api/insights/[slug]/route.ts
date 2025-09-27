import { NextResponse } from "next/server";
import { getInsightBySlug } from "@/lib/sanity/insights";

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
      return NextResponse.json({ insight: null }, { status: 404 });
    }

    const insight = await getInsightBySlug(slug);

    if (!insight) {
      return NextResponse.json({ insight: null }, { status: 404 });
    }

    return NextResponse.json({ insight });
  } catch (error) {
    return NextResponse.json(
      { insight: null, error: "Failed to load insight" },
      { status: 500 }
    );
  }
}
