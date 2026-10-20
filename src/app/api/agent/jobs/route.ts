import { NextRequest, NextResponse } from "next/server";
import { JobStore } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);
    const token =
      authHeader?.replace("Bearer ", "").trim() ||
      searchParams.get("token") ||
      request.headers.get("x-agent-token");

    // Default development token matching Sharma Cyber Cafe
    const validTokens = ["agent_sharma_cyber_live_token_99x", "demo_token_123"];

    if (!token || !validTokens.includes(token)) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid agent pairing token." },
        { status: 401 }
      );
    }

    // Get jobs that are in QUEUED state (ready for physical printer)
    const pendingJobs = await JobStore.getPendingAgentJobs("shop_sharma_001");

    return NextResponse.json({
      success: true,
      pendingCount: pendingJobs.length,
      jobs: pendingJobs,
    });
  } catch (error) {
    console.error("Agent polling error:", error);
    return NextResponse.json({ error: "Failed to poll agent jobs" }, { status: 500 });
  }
}
