import { NextResponse } from "next/server";
import { getCareers } from "@/lib/sanity/careers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const careers = await getCareers();
    return NextResponse.json({ careers });
  } catch (error) {
    return NextResponse.json(
      { careers: [], error: "Failed to load careers" },
      { status: 500 }
    );
  }
}
