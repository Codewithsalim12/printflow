// ============================================================
// PrintFlow Windows Agent (Production Silent Spooler)
// Target: Runs on Shop PC (Windows 7/10/11) with < 25MB RAM
// Zero dialogs, zero clicks, auto-routed to physical printers.
// ============================================================

import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import { execFile, exec } from "child_process";
import { fileURLToPath } from "url";
import printerPkg from "pdf-to-printer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const printerModule = printerPkg.default || printerPkg;

const CONFIG = {
  apiUrl: process.env.PRINTFLOW_API_URL || "http://localhost:3000",
  agentToken: process.env.PRINTFLOW_AGENT_TOKEN || "agent_sharma_cyber_live_token_99x",
  shopId: process.env.PRINTFLOW_SHOP_ID || "shop_sharma_001",
  pollIntervalMs: 2500,
  tempDir: path.resolve(__dirname, "./temp_print_spool"),
  sumatraBin: path.resolve(__dirname, "./bin/SumatraPDF.exe"),
};

// Ensure temporary spool directory exists
if (!fs.existsSync(CONFIG.tempDir)) {
  fs.mkdirSync(CONFIG.tempDir, { recursive: true });
}

// Clean any leftover orphan files from previous crashes
try {
  const leftovers = fs.readdirSync(CONFIG.tempDir);
  for (const f of leftovers) {
    fs.unlinkSync(path.join(CONFIG.tempDir, f));
  }
} catch {}

let detectedPrinters = [];
let defaultBwPrinter = null;
let defaultColorPrinter = null;

console.log("====================================================");
console.log("🖨️  PrintFlow Windows Agent v2.0 (Silent Spooler)   ");
console.log(`📡 Connecting to Cloud Server: ${CONFIG.apiUrl}`);
console.log(`🔑 Shop Agent Token:          ${CONFIG.agentToken}`);
console.log(`📁 Local Spool Directory:     ${CONFIG.tempDir}`);
console.log("====================================================\n");

// 1. Hardware Discovery: Query Windows Printers
async function discoverAndSyncPrinters() {
  try {
    console.log("🔍 Detecting physical printers installed on this Windows PC...");
    detectedPrinters = await printerModule.getPrinters();

    if (!detectedPrinters || detectedPrinters.length === 0) {
      console.warn("⚠️ No printers found on this system.");
      return;
    }

    console.log(`✅ Found ${detectedPrinters.length} installed printers:`);
    detectedPrinters.forEach((p, idx) => {
      console.log(`   ${idx + 1}. [${p.name}] (Paper: ${p.paperSizes?.join(", ") || "A4"})`);
    });

    // Auto-identify best candidates for B&W laser and Color InkTank
    const defaultSysPrinter = await printerModule.getDefaultPrinter().catch(() => null);

    defaultBwPrinter =
      detectedPrinters.find((p) => /hp|brother|laser|canon/i.test(p.name))?.name ||
      defaultSysPrinter?.name ||
      detectedPrinters[0].name;

    defaultColorPrinter =
      detectedPrinters.find((p) => /epson|color|ink|deskjet|l3150|l3210/i.test(p.name))?.name ||
      defaultBwPrinter;

    console.log(`\n📌 Auto-Assigned Printer Routes:`);
    console.log(`   • Black & White (Laser): [${defaultBwPrinter}]`);
    console.log(`   • Full Colour (InkTank): [${defaultColorPrinter}]\n`);

    // Sync with web dashboard so shopkeeper sees live hardware status
    const syncRes = await fetch(`${CONFIG.apiUrl}/api/agent/sync-printers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CONFIG.agentToken}`,
      },
      body: JSON.stringify({
        shopId: CONFIG.shopId,
        printers: detectedPrinters,
      }),
    });

    if (syncRes.ok) {
      console.log("☁️  Printers synced successfully with shopkeeper dashboard.");
    }
  } catch (err) {
    console.error("❌ Printer discovery error:", err.message);
  }
}

// 2. Download customer file
async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destPath);
    client
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: Status ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close(() => resolve(destPath));
        });
      })
      .on("error", (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
  });
}

// 3. Update job status on the cloud API
async function updateJobStatus(jobId, status, failureReason = null) {
  try {
    const res = await fetch(`${CONFIG.apiUrl}/api/agent/jobs/${jobId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, failureReason }),
    });
    return res.ok;
  } catch (err) {
    console.error(`[Agent] Failed to update status for ${jobId}:`, err.message);
    return false;
  }
}

// 4. Silent Print Spooling via SumatraPDF CLI
function printSilentlyWithSumatra(pdfPath, printerName, options = {}) {
  return new Promise((resolve, reject) => {
    const sumatraExe = fs.existsSync(CONFIG.sumatraBin)
      ? CONFIG.sumatraBin
      : path.resolve(
          __dirname,
          "../node_modules/pdf-to-printer/dist/SumatraPDF-3.4.6-32.exe"
        );

    // Build print settings string
    // Format: "copies=1,duplex,color"
    const settingsParts = [];
    if (options.copies && options.copies > 1) {
      settingsParts.push(`${options.copies}x`);
    }
    if (options.isDuplex) {
      settingsParts.push("duplex");
    } else {
      settingsParts.push("simplex");
    }
    if (options.isColor) {
      settingsParts.push("color");
    } else {
      settingsParts.push("monochrome");
    }
    if (options.pageRange && options.pageRange !== "all") {
      settingsParts.push(options.pageRange);
    }

    const printSettings = settingsParts.join(",");

    const args = ["-print-to", printerName, "-silent"];

    if (printSettings) {
      args.push("-print-settings", printSettings);
    }

    // Password unlocking for Aadhaar cards / bank statements
    if (options.pdfPassword) {
      args.push("-pwd", options.pdfPassword);
    }

    args.push(pdfPath);

    console.log(`   ⚙️ Executing silent spool:`);
    console.log(`      Target Printer: "${printerName}"`);
    console.log(`      Settings:       ${printSettings || "default"}`);
    if (options.pdfPassword) {
      console.log(`      Password:       [Protected PDF Key Applied]`);
    }

    execFile(sumatraExe, args, (error) => {
      if (error) {
        console.error("   ❌ Spooler error:", error.message);
        return reject(error);
      }
      resolve(true);
    });
  });
}

// 5. Job Processor
async function processJob(job) {
  console.log(`\n====================================================`);
  console.log(`📥 [NEW PRINT JOB] Token: #${job.id}`);
  console.log(`   📄 Document: "${job.originalFileName}"`);
  console.log(`   ⚙️ Options:  Pages: ${job.totalPages} | Copies: ${job.copies} | Duplex: ${job.isDuplex} | Color: ${job.isColor}`);
  console.log(`   💰 Amount:   ₹${job.totalAmount} | Payment: ${job.paymentStatus}`);

  // Step A: Mark as PRINTING
  await updateJobStatus(job.id, "PRINTING");

  const ext = path.extname(job.originalFileName) || ".pdf";
  const localFilePath = path.join(CONFIG.tempDir, `${job.id}${ext}`);

  try {
    // Step B: Download to secure local spool directory
    let downloadUrl = job.fileUrl;
    if (!downloadUrl.startsWith("http")) {
      downloadUrl = `${CONFIG.apiUrl}${downloadUrl.startsWith("/") ? "" : "/"}${downloadUrl}`;
    } else if (downloadUrl.includes("localhost") && !CONFIG.apiUrl.includes("localhost")) {
      downloadUrl = downloadUrl.replace(/^https?:\/\/[^/]+/, CONFIG.apiUrl);
    }

    console.log(`   ⏳ Downloading temporary file from ${downloadUrl}...`);
    await downloadFile(downloadUrl, localFilePath);
    console.log(`   ✓ File cached temporarily at: ${localFilePath}`);

    // Step C: Choose correct printer route (Laser vs InkTank)
    const targetPrinter = job.isColor
      ? defaultColorPrinter || defaultBwPrinter
      : defaultBwPrinter || defaultColorPrinter;

    console.log(`   🎯 Selected Hardware Route: [${targetPrinter}]`);

    // Step D: Send silent print job to physical Windows Spooler
    await printSilentlyWithSumatra(localFilePath, targetPrinter, {
      copies: job.copies,
      isDuplex: job.isDuplex,
      isColor: job.isColor,
      pageRange: job.pageRange,
      pdfPassword: job.pdfPassword,
    });

    console.log(`   🎉 Spooled successfully to Windows Print Spooler!`);

    // Step E: Update cloud status to PRINTED
    await updateJobStatus(job.id, "PRINTED");

    // Step F: Immediate Security Purge (Customer Privacy)
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log(`   🔒 Local temporary file permanently purged.`);
    }

    console.log(`✅ [COMPLETED] Job #${job.id} done!`);
  } catch (err) {
    console.error(`   ❌ Failed to print job #${job.id}:`, err.message);
    await updateJobStatus(job.id, "FAILED", err.message);

    // Clean up temporary file even on failure
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch {}
    }
  }
}

// 6. Polling Queue Loop
async function pollQueue() {
  try {
    const url = `${CONFIG.apiUrl}/api/agent/jobs?token=${CONFIG.agentToken}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.jobs && data.jobs.length > 0) {
        for (const job of data.jobs) {
          await processJob(job);
        }
      }
    }
  } catch (err) {
    // Server might be temporarily booting; silent wait
  }
}

// Bootstrap Agent
async function startAgent() {
  await discoverAndSyncPrinters();
  setInterval(pollQueue, CONFIG.pollIntervalMs);
  pollQueue();
  console.log("👀 Agent is now actively listening for paid customer print jobs...\n");
}

startAgent();
