import { NextRequest, NextResponse } from "next/server";
import { StorageService } from "@/lib/storage";
import { JobStore } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const shopSlug = (formData.get("shopSlug") as string) || "sharma-cyber-cafe";
    const shopId = (formData.get("shopId") as string) || "shop_sharma_001";
    const copies = parseInt((formData.get("copies") as string) || "1", 10);
    const totalPages = parseInt((formData.get("totalPages") as string) || "1", 10);
    const paperSize = (formData.get("paperSize") as string) || "A4";
    const isColor = formData.get("isColor") === "true";
    const isDuplex = formData.get("isDuplex") === "true";
    const pageRange = (formData.get("pageRange") as string) || "all";
    const paymentMethod = (formData.get("paymentMethod") as string) || "PAY_AT_COUNTER";
    const customerPhone = (formData.get("customerPhone") as string) || "";
    const customerName = (formData.get("customerName") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Security: Max 50MB limit
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit. Please upload a smaller document." },
        { status: 400 }
      );
    }

    // Security: Validate document extensions
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const isDoc = file.type?.includes("pdf") || file.type?.includes("image") || ["pdf", "jpg", "jpeg", "png"].includes(fileExt || "");
    if (!isDoc) {
      return NextResponse.json(
        { error: "Unsupported file format. Please upload a PDF or JPG/PNG image." },
        { status: 400 }
      );
    }

    // Save uploaded file to storage (local or cloud)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stored = await StorageService.saveFile(buffer, file.name, file.type);

    // Calculate Price according to Shop Pricing Rules
    const shop = await JobStore.getShop(shopSlug);
    let perPagePrice = isColor ? (isDuplex ? 18.0 : 10.0) : (isDuplex ? 3.0 : 2.0);

    if (shop) {
      const rule = shop.pricingRules.find(
        (r) => r.paperSize === paperSize && r.isColor === isColor && r.isDuplex === isDuplex
      );
      if (rule) {
        perPagePrice = rule.perPagePrice;
      }
    }

    // For duplex, total sheets = Math.ceil(totalPages / 2), but per sheet pricing applies
    const chargeableUnits = isDuplex ? Math.ceil(totalPages / 2) : totalPages;
    const calculatedAmount = Math.max(2.0, chargeableUnits * perPagePrice * copies);

    // Determine initial status:
    // If Pay at Counter -> AWAITING_PAYMENT (Shopkeeper must approve on counter screen)
    // If UPI demo test -> auto-transition to PAID -> QUEUED for immediate printing demo
    const isOnlinePayment = paymentMethod === "UPI";
    const paymentStatus = isOnlinePayment ? "PAID" : "PENDING";
    const printStatus = isOnlinePayment ? "QUEUED" : "AWAITING_PAYMENT";

    const job = await JobStore.createJob({
      shopId: shop?.id || shopId,
      originalFileName: file.name,
      fileKey: stored.key,
      fileUrl: stored.url,
      fileType: file.type || "application/pdf",
      fileSizeBytes: file.size,
      totalPages,
      pageRange,
      copies,
      paperSize,
      isColor,
      isDuplex,
      totalAmount: calculatedAmount,
      paymentMethod,
      paymentStatus,
      printStatus,
      customerPhone,
      customerName,
    });

    return NextResponse.json({
      success: true,
      job,
      message:
        paymentMethod === "PAY_AT_COUNTER"
          ? "Job sent! Please show your Token Code at the counter to print."
          : "Payment verified! Your document is queued for printing.",
    });
  } catch (error) {
    console.error("Error creating print job:", error);
    return NextResponse.json({ error: "Failed to create print job" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shopId") || "shop_sharma_001";
    const jobs = await JobStore.getAllJobsForShop(shopId);
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to list jobs" }, { status: 500 });
  }
}
