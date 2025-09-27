import { getInsights } from "@/lib/sanity/insights";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const insights = await getInsights();
    return NextResponse.json(insights);
  } catch (error) {
    console.error("Failed to fetch insights:", error);
    return NextResponse.json(
      { message: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}
