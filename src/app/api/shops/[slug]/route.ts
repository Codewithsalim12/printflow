import { NextRequest, NextResponse } from "next/server";
import { JobStore } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const shop = await JobStore.getShop(slug);

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json({ shop });
  } catch (error) {
    console.error("Error fetching shop:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
