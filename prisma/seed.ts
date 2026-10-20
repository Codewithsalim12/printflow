import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for PrintFlow...");

  // Clean existing demo data if needed
  const existingShop = await prisma.shop.findUnique({
    where: { slug: "sharma-cyber-cafe" },
  });

  if (existingShop) {
    console.log("Sharma Cyber Cafe already exists, skipping duplicate creation.");
    return;
  }

  // 1. Create Demo Shop
  const shop = await prisma.shop.create({
    data: {
      name: "Sharma Cyber Cafe & Xerox Center",
      slug: "sharma-cyber-cafe",
      ownerName: "Rakesh Sharma",
      email: "contact@sharmacyber.com",
      phone: "+91 98765 43210",
      address: "Shop No. 4, College Road, Opp. University Gate",
      status: "ACTIVE",
      plan: "PRO",
      apiToken: "agent_sharma_cyber_live_token_99x",
      counterCode: "7890",
      qrCodeUrl: "/api/qr/sharma-cyber-cafe",
    },
  });

  // 2. Create Owner User
  await prisma.user.create({
    data: {
      shopId: shop.id,
      name: "Rakesh Sharma",
      email: "rakesh@sharmacyber.com",
      phone: "+91 98765 43210",
      passwordHash: "demo_hash_password123",
      role: "OWNER",
    },
  });

  // 3. Create Default Printers (Laser B&W + InkTank Color)
  await prisma.printer.createMany({
    data: [
      {
        shopId: shop.id,
        name: "HP LaserJet 1020 Plus",
        systemName: "HP LaserJet 1020",
        type: "LASER",
        isColor: false,
        supportsDuplex: false,
        paperSizes: ["A4", "Legal"],
        isDefaultBw: true,
        isDefaultColor: false,
        status: "ONLINE",
      },
      {
        shopId: shop.id,
        name: "Epson EcoTank L3210",
        systemName: "EPSON L3210 Series",
        type: "INKTANK",
        isColor: true,
        supportsDuplex: false,
        paperSizes: ["A4", "4x6", "Legal"],
        isDefaultBw: false,
        isDefaultColor: true,
        status: "ONLINE",
      },
    ],
  });

  // 4. Create Standard Indian Shop Pricing Rules
  await prisma.pricingRule.createMany({
    data: [
      {
        shopId: shop.id,
        paperSize: "A4",
        isColor: false,
        isDuplex: false,
        perPagePrice: 2.0, // ₹2 / page
        minimumOrder: 2.0,
      },
      {
        shopId: shop.id,
        paperSize: "A4",
        isColor: false,
        isDuplex: true,
        perPagePrice: 3.0, // ₹3 for both sides
        minimumOrder: 3.0,
      },
      {
        shopId: shop.id,
        paperSize: "A4",
        isColor: true,
        isDuplex: false,
        perPagePrice: 10.0, // ₹10 / page
        minimumOrder: 10.0,
      },
      {
        shopId: shop.id,
        paperSize: "A4",
        isColor: true,
        isDuplex: true,
        perPagePrice: 18.0, // ₹18 for both sides
        minimumOrder: 18.0,
      },
      {
        shopId: shop.id,
        paperSize: "Legal",
        isColor: false,
        isDuplex: false,
        perPagePrice: 3.0, // ₹3 / page for court/legal
        minimumOrder: 3.0,
      },
      {
        shopId: shop.id,
        paperSize: "Legal",
        isColor: false,
        isDuplex: true,
        perPagePrice: 5.0, // ₹5 for both sides
        minimumOrder: 5.0,
      },
    ],
  });

  console.log("✅ Seed completed successfully! Demo shop: Sharma Cyber Cafe (slug: sharma-cyber-cafe)");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
