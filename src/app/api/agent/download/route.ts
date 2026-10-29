import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export async function GET(_request: NextRequest) {
  try {
    const downloadsDir = path.resolve(process.cwd(), "public/downloads");
    const zipPath = path.resolve(downloadsDir, "printflow-agent.zip");

    // Auto-generate if missing
    if (!fs.existsSync(zipPath)) {
      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }
      try {
        execSync(
          'powershell -NoProfile -Command "Compress-Archive -Path \'agent\\*\' -DestinationPath \'public\\downloads\\printflow-agent.zip\' -Force"',
          { stdio: "ignore" }
        );
      } catch (err) {
        console.error("Auto zip archive failed:", err);
      }
    }

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
