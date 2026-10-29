import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const zipPath = path.resolve(process.cwd(), "public/downloads/printflow-agent.zip");

    if (!fs.existsSync(zipPath)) {
      return NextResponse.json({ error: "Agent package not ready" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(zipPath);

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="PrintFlow-Agent-v2.zip"',
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Agent download error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
