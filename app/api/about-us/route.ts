import { NextResponse } from "next/server";
import { getAboutPageData } from "@/lib/sanity/about";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const about = await getAboutPageData();
    return NextResponse.json({ about });
  } catch (error) {
    return NextResponse.json(
      { about: null, error: "Failed to load about content" },
      { status: 500 }
    );
  }
}
