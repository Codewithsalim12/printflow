import { NextRequest, NextResponse } from "next/server";
import { JobStore } from "@/lib/store";
import { StorageService } from "@/lib/storage";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, failureReason } = body;

    const validStatuses = ["QUEUED", "PRINTING", "PRINTED", "FAILED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid print status" }, { status: 400 });
    }

    const job = await JobStore.getJob(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const updatedJob = await JobStore.updateJobStatus(id, status);

    // If successfully printed, automatically purge temporary file for customer privacy & data security
    if (status === "PRINTED" && job.fileKey) {
      await StorageService.deleteFile(job.fileKey);
      console.log(`[Privacy Security] Successfully deleted temporary customer file: ${job.fileKey}`);
    }

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: `Job ${id} updated to ${status}`,
    });
  } catch (error) {
    console.error("Agent status update error:", error);
    return NextResponse.json({ error: "Failed to update job status" }, { status: 500 });
  }
}
