import { NextRequest, NextResponse } from "next/server";
import { StorageService } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const file = await StorageService.getFile(key);

    if (!file) {
      return NextResponse.json({ error: "File not found or expired" }, { status: 404 });
    }

    const ext = key.split(".").pop()?.toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === "pdf") contentType = "application/pdf";
    else if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
    else if (ext === "png") contentType = "image/png";

    const uint8Array = new Uint8Array(file.buffer);
    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${key}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
