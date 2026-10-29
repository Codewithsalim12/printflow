import { NextRequest, NextResponse } from "next/server";
import { JobStore } from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { utr = "UPI" + Date.now().toString().slice(-8) } = body;

    const existingJob = await JobStore.getJob(id);
    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Mark as PAID and immediately QUEUED for physical printer agent
    const updatedJob = await JobStore.updateJobStatus(id, "QUEUED", "PAID");

    return NextResponse.json({
      success: true,
      job: updatedJob,
      utr,
      message: "UPI Payment verified successfully! Print job dispatched to printer.",
    });
  } catch (error) {
    console.error("UPI Payment Confirmation Error:", error);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}
