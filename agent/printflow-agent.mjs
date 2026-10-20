// ============================================================
// PrintFlow Windows Agent (Lightweight Polling Daemon)
// Target: Runs on Shop PC (Windows 7/10/11) with < 25MB RAM
// ============================================================

import fs from "fs";
import path from "path";
import http from "http";
import https from "https";

const CONFIG = {
  apiUrl: process.env.PRINTFLOW_API_URL || "http://localhost:3000",
  agentToken: process.env.PRINTFLOW_AGENT_TOKEN || "agent_sharma_cyber_live_token_99x",
  pollIntervalMs: 2500,
  tempDir: path.resolve("./temp_print_spool"),
};

// Ensure temporary spool directory exists
if (!fs.existsSync(CONFIG.tempDir)) {
  fs.mkdirSync(CONFIG.tempDir, { recursive: true });
}

console.log("====================================================");
console.log("🖨️  PrintFlow Windows Agent v1.0.0 Started");
console.log(`📡 Connecting to: ${CONFIG.apiUrl}`);
console.log(`🔑 Shop Agent Token: ${CONFIG.agentToken}`);
console.log(`📁 Local Spool Directory: ${CONFIG.tempDir}`);
console.log("====================================================\n");

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

async function updateJobStatus(jobId, status) {
  try {
    const res = await fetch(`${CONFIG.apiUrl}/api/agent/jobs/${jobId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (err) {
    console.error(`[Agent] Failed to update status for ${jobId}:`, err.message);
    return false;
  }
}

async function processJob(job) {
  console.log(`\n📥 [NEW JOB] ${job.id}: "${job.originalFileName}"`);
  console.log(`   📄 Pages: ${job.totalPages} | Copies: ${job.copies} | Duplex: ${job.isDuplex} | Color: ${job.isColor}`);
  console.log(`   💰 Amount: ₹${job.totalAmount} | Payment: ${job.paymentStatus}`);

  // 1. Mark as PRINTING
  await updateJobStatus(job.id, "PRINTING");

  // 2. Download file to local temporary spool
  const ext = path.extname(job.originalFileName) || ".pdf";
  const localFilePath = path.join(CONFIG.tempDir, `${job.id}${ext}`);

  try {
    console.log(`   ⏳ Downloading temporary file from ${job.fileUrl}...`);
    await downloadFile(job.fileUrl, localFilePath);
    console.log(`   ✓ File cached at ${localFilePath}`);

    // 3. Spool to printer (Simulated or via SumatraPDF CLI on physical Windows PC)
    console.log(`   🖨️ Spooling to printer...`);
    // Example production execution:
    // exec(`SumatraPDF.exe -print-to "HP LaserJet 1020" -silent "${localFilePath}"`)
    await new Promise((r) => setTimeout(r, 2000)); // Simulating spooling time

    // 4. Mark as PRINTED
    await updateJobStatus(job.id, "PRINTED");
    console.log(`   ✅ Print job ${job.id} completed successfully!`);

    // 5. Immediate local file purge for data privacy & zero disk buildup
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log(`   🔒 Local temporary file purged immediately.`);
    }
  } catch (err) {
    console.error(`   ❌ Print failed for ${job.id}:`, err.message);
    await updateJobStatus(job.id, "FAILED");
  }
}

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
    // Server might be starting or polling interval waiting
  }
}

// Start polling loop
setInterval(pollQueue, CONFIG.pollIntervalMs);
pollQueue();
