import { NextRequest, NextResponse } from "next/server";
import { JobStore } from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingJob = await JobStore.getJob(id);

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Mark as PAID and QUEUED for the Windows Print Agent to pick up
    const updatedJob = await JobStore.updateJobStatus(id, "QUEUED", "PAID");

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: "Payment confirmed at counter! Job queued for printer.",
    });
  } catch (error) {
    console.error("Error approving counter job:", error);
    return NextResponse.json({ error: "Failed to approve job" }, { status: 500 });
  }
}
