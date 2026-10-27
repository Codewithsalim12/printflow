import { NextRequest, NextResponse } from "next/server";
import { JobStore } from "@/lib/store";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);
    const token =
      authHeader?.replace("Bearer ", "").trim() ||
      searchParams.get("token") ||
      request.headers.get("x-agent-token");

    const validTokens = ["agent_sharma_cyber_live_token_99x", "demo_token_123"];

    if (!token || !validTokens.includes(token)) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid agent pairing token." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { printers, shopId = "shop_sharma_001" } = body;

    if (!Array.isArray(printers)) {
      return NextResponse.json({ error: "Invalid printers payload" }, { status: 400 });
    }

    console.log(`[Agent Sync] Received ${printers.length} detected Windows printers for shop ${shopId}`);

    // Update in-memory store
    JobStore.updateSyncedPrinters(shopId, printers);

    // Update in database if connected
    try {
      for (const p of printers) {
        const isColorGuess = /color|epson|deskjet|ink|l3150|l3210/i.test(p.name);
        const supportsDuplexGuess = /duplex|brother|hp laserjet.*d/i.test(p.name);

        await prisma.printer.upsert({
          where: { id: `printer_${p.name.replace(/\W+/g, "_")}` },
          update: {
            status: "ONLINE",
            lastSeenAt: new Date(),
            paperSizes: p.paperSizes || ["A4", "Legal"],
          },
          create: {
            id: `printer_${p.name.replace(/\W+/g, "_")}`,
            shopId,
            name: p.name,
            systemName: p.name,
            isColor: isColorGuess,
            supportsDuplex: supportsDuplexGuess,
            paperSizes: p.paperSizes || ["A4", "Legal"],
            isDefaultBw: !isColorGuess,
            isDefaultColor: isColorGuess,
            status: "ONLINE",
            lastSeenAt: new Date(),
          },
        });
      }
    } catch {
      // Memory fallback active in dev
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${printers.length} hardware printers`,
      detectedPrinters: printers.map((p) => p.name),
    });
  } catch (error) {
    console.error("Printer sync error:", error);
    return NextResponse.json({ error: "Failed to sync printers" }, { status: 500 });
  }
}
