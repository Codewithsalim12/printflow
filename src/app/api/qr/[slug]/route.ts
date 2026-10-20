import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin || "http://localhost:3000";
    const targetUrl = `${origin}/print/${slug}`;

    // Generate high resolution SVG for crisp counter standee printing
    const svgString = await QRCode.toString(targetUrl, {
      type: "svg",
      width: 400,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });

    return new NextResponse(svgString, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}
