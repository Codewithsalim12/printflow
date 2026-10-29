import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pa = searchParams.get("pa") || "sharma.cyber@upi";
    const pn = searchParams.get("pn") || "Sharma Cyber Cafe";
    const am = searchParams.get("am") || "2.00";
    const tn = searchParams.get("tn") || "PrintFlow_Print";

    // Standard NPCI UPI URI Scheme
    const upiUri = `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${encodeURIComponent(am)}&tn=${encodeURIComponent(tn)}&cu=INR`;

    const svgString = await QRCode.toString(upiUri, {
      type: "svg",
      width: 320,
      margin: 1,
      color: {
        dark: "#111114",
        light: "#ffffff",
      },
    });

    return new NextResponse(svgString, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("UPI QR Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate UPI QR" }, { status: 500 });
  }
}
