// Store abstraction: uses Prisma database with memory fallback for development
import { prisma } from "@/lib/db";

export interface DemoShopData {
  id: string;
  slug: string;
  name: string;
  ownerName: string;
  phone: string;
  address: string;
  status: string;
  counterCode: string;
  apiToken: string;
  pricingRules: {
    paperSize: string;
    isColor: boolean;
    isDuplex: boolean;
    perPagePrice: number;
    minimumOrder: number;
  }[];
  printers: {
    id: string;
    name: string;
    isColor: boolean;
    supportsDuplex: boolean;
    status: string;
  }[];
}

export const FALLBACK_SHARMA_SHOP: DemoShopData = {
  id: "shop_sharma_001",
  slug: "sharma-cyber-cafe",
  name: "Sharma Cyber Cafe & Xerox Center",
  ownerName: "Rakesh Sharma",
  phone: "+91 98765 43210",
  address: "Shop No. 4, College Road, Opp. University Gate",
  status: "ACTIVE",
  counterCode: "7890",
  apiToken: "agent_sharma_cyber_live_token_99x",
  printers: [
    {
      id: "p1",
      name: "HP LaserJet 1020 Plus",
      isColor: false,
      supportsDuplex: false,
      status: "ONLINE",
    },
    {
      id: "p2",
      name: "Epson EcoTank L3210",
      isColor: true,
      supportsDuplex: false,
      status: "ONLINE",
    },
  ],
  pricingRules: [
    { paperSize: "A4", isColor: false, isDuplex: false, perPagePrice: 2.0, minimumOrder: 2.0 },
    { paperSize: "A4", isColor: false, isDuplex: true, perPagePrice: 3.0, minimumOrder: 3.0 },
    { paperSize: "A4", isColor: true, isDuplex: false, perPagePrice: 10.0, minimumOrder: 10.0 },
    { paperSize: "A4", isColor: true, isDuplex: true, perPagePrice: 18.0, minimumOrder: 18.0 },
    { paperSize: "Legal", isColor: false, isDuplex: false, perPagePrice: 3.0, minimumOrder: 3.0 },
    { paperSize: "Legal", isColor: false, isDuplex: true, perPagePrice: 5.0, minimumOrder: 5.0 },
  ],
};

// Global in-memory job queue for instant dev testing without mandatory local postgres
interface InMemoryJob {
  id: string;
  shopId: string;
  originalFileName: string;
  fileKey: string;
  fileUrl: string;
  fileType: string;
  fileSizeBytes: number;
  totalPages: number;
  pageRange: string;
  copies: number;
  paperSize: string;
  isColor: boolean;
  isDuplex: boolean;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  printStatus: string;
  customerPhone?: string;
  customerName?: string;
  createdAt: string;
}

const memoryJobs = new Map<string, InMemoryJob>();

export class JobStore {
  static async getShop(slug: string): Promise<DemoShopData | null> {
    try {
      const dbShop = await prisma.shop.findUnique({
        where: { slug },
        include: { pricingRules: true, printers: true },
      });
      if (dbShop) {
        return {
          id: dbShop.id,
          slug: dbShop.slug,
          name: dbShop.name,
          ownerName: dbShop.ownerName || "",
          phone: dbShop.phone || "",
          address: dbShop.address || "",
          status: dbShop.status,
          counterCode: dbShop.counterCode || "1234",
          apiToken: dbShop.apiToken,
          printers: dbShop.printers.map((p) => ({
            id: p.id,
            name: p.name,
            isColor: p.isColor,
            supportsDuplex: p.supportsDuplex,
            status: p.status,
          })),
          pricingRules: dbShop.pricingRules.map((r) => ({
            paperSize: r.paperSize,
            isColor: r.isColor,
            isDuplex: r.isDuplex,
            perPagePrice: r.perPagePrice,
            minimumOrder: r.minimumOrder,
          })),
        };
      }
    } catch {
      // Database not reachable yet, fall back gracefully to seeded demo shop
    }

    if (slug === "sharma-cyber-cafe") {
      return FALLBACK_SHARMA_SHOP;
    }
    return null;
  }

  static async createJob(jobData: Omit<InMemoryJob, "id" | "createdAt">): Promise<InMemoryJob> {
    const id = `job_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const newJob: InMemoryJob = {
      ...jobData,
      id,
      createdAt: new Date().toISOString(),
    };

    // Store in memory
    memoryJobs.set(id, newJob);

    // Try saving in Prisma if DB available
    try {
      await prisma.printJob.create({
        data: {
          id,
          shopId: jobData.shopId,
          originalFileName: jobData.originalFileName,
          fileKey: jobData.fileKey,
          fileUrl: jobData.fileUrl,
          fileType: jobData.fileType,
          fileSizeBytes: jobData.fileSizeBytes,
          totalPages: jobData.totalPages,
          pageRange: jobData.pageRange,
          copies: jobData.copies,
          paperSize: jobData.paperSize,
          isColor: jobData.isColor,
          isDuplex: jobData.isDuplex,
          totalAmount: jobData.totalAmount,
          paymentMethod: jobData.paymentMethod,
          paymentStatus: jobData.paymentStatus,
          printStatus: jobData.printStatus,
          customerPhone: jobData.customerPhone,
          customerName: jobData.customerName,
        },
      });
    } catch {
      // Memory fallback active
    }

    return newJob;
  }

  static async getJob(id: string): Promise<InMemoryJob | null> {
    try {
      const dbJob = await prisma.printJob.findUnique({ where: { id } });
      if (dbJob) {
        return {
          id: dbJob.id,
          shopId: dbJob.shopId,
          originalFileName: dbJob.originalFileName,
          fileKey: dbJob.fileKey,
          fileUrl: dbJob.fileUrl || "",
          fileType: dbJob.fileType,
          fileSizeBytes: dbJob.fileSizeBytes,
          totalPages: dbJob.totalPages,
          pageRange: dbJob.pageRange || "all",
          copies: dbJob.copies,
          paperSize: dbJob.paperSize,
          isColor: dbJob.isColor,
          isDuplex: dbJob.isDuplex,
          totalAmount: dbJob.totalAmount,
          paymentMethod: dbJob.paymentMethod,
          paymentStatus: dbJob.paymentStatus,
          printStatus: dbJob.printStatus,
          customerPhone: dbJob.customerPhone || undefined,
          customerName: dbJob.customerName || undefined,
          createdAt: dbJob.createdAt.toISOString(),
        };
      }
    } catch {
      // Fallback to memory
    }
    return memoryJobs.get(id) || null;
  }

  static async updateJobStatus(id: string, printStatus: string, paymentStatus?: string): Promise<InMemoryJob | null> {
    const job = memoryJobs.get(id);
    if (job) {
      job.printStatus = printStatus;
      if (paymentStatus) job.paymentStatus = paymentStatus;
      memoryJobs.set(id, job);
    }

    try {
      await prisma.printJob.update({
        where: { id },
        data: {
          printStatus,
          ...(paymentStatus ? { paymentStatus } : {}),
        },
      });
    } catch {
      // Memory fallback
    }

    return job || null;
  }

  static async getAllJobsForShop(shopId: string): Promise<InMemoryJob[]> {
    try {
      const dbJobs = await prisma.printJob.findMany({
        where: { shopId },
        orderBy: { createdAt: "desc" },
      });
      if (dbJobs.length > 0) {
        return dbJobs.map((j) => ({
          id: j.id,
          shopId: j.shopId,
          originalFileName: j.originalFileName,
          fileKey: j.fileKey,
          fileUrl: j.fileUrl || "",
          fileType: j.fileType,
          fileSizeBytes: j.fileSizeBytes,
          totalPages: j.totalPages,
          pageRange: j.pageRange || "all",
          copies: j.copies,
          paperSize: j.paperSize,
          isColor: j.isColor,
          isDuplex: j.isDuplex,
          totalAmount: j.totalAmount,
          paymentMethod: j.paymentMethod,
          paymentStatus: j.paymentStatus,
          printStatus: j.printStatus,
          customerPhone: j.customerPhone || undefined,
          customerName: j.customerName || undefined,
          createdAt: j.createdAt.toISOString(),
        }));
      }
    } catch {
      // Fallback to memory
    }

    return Array.from(memoryJobs.values())
      .filter((j) => j.shopId === shopId || shopId === "shop_sharma_001")
      .reverse();
  }

  static async getPendingAgentJobs(shopId: string): Promise<InMemoryJob[]> {
    const all = await this.getAllJobsForShop(shopId);
    // Return jobs that are ready for the Windows agent (paid or counter-approved and in QUEUED status)
    return all.filter((j) => j.printStatus === "QUEUED");
  }
}
