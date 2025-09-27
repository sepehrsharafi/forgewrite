import { NextResponse } from "next/server";
import { getServicesPageData } from "@/lib/sanity/services";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await getServicesPageData();
    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json(
      { services: null, error: "Failed to load services" },
      { status: 500 }
    );
  }
}
