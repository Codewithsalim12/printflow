import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pa = searchParams.get("pa") || "sharma.cyber@upi";
    const pn = searchParams.get("pn") || "Sharma Cyber Cafe";
    const am = searchParams.get("am") || "2.00";
    const tn = searchParams.get("tn") || "PrintFlow_Print";

    const cleanAm = parseFloat(am) > 0 ? parseFloat(am).toFixed(2) : "2.00";

    // Standard NPCI UPI URI Scheme (@ in VPA must remain unescaped for GPay/PhonePe)
    const upiUri = `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${cleanAm}&tn=${encodeURIComponent(tn)}&cu=INR`;

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
