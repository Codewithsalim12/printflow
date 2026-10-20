import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export interface StoredFile {
  key: string;
  originalName: string;
  sizeBytes: number;
  mimeType: string;
  url: string;
}

export class StorageService {
  private static initLocalDir() {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  }

  /**
   * Save an uploaded file buffer to storage (local dev or cloud)
   */
  static async saveFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<StoredFile> {
    const ext = path.extname(originalName) || (mimeType.includes("pdf") ? ".pdf" : ".bin");
    const uniqueId = crypto.randomUUID();
    const key = `${uniqueId}${ext}`;

    const provider = process.env.STORAGE_PROVIDER || "local";

    if (provider === "local") {
      this.initLocalDir();
      const filePath = path.join(UPLOAD_DIR, key);
      await fs.promises.writeFile(filePath, fileBuffer);

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return {
        key,
        originalName,
        sizeBytes: fileBuffer.length,
        mimeType,
        url: `${appUrl}/api/files/${key}`,
      };
    }

    // Fallback for cloud providers (R2/S3 configured later in production)
    throw new Error(`Storage provider [${provider}] is not yet configured with production keys.`);
  }

  /**
   * Read file stream or buffer for download/agent polling
   */
  static async getFile(key: string): Promise<{ buffer: Buffer; filePath: string } | null> {
    const filePath = path.join(UPLOAD_DIR, key);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const buffer = await fs.promises.readFile(filePath);
    return { buffer, filePath };
  }

  /**
   * Purge temporary file after printing or on expiry timeout
   */
  static async deleteFile(key: string): Promise<boolean> {
    const filePath = path.join(UPLOAD_DIR, key);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
    } catch (err) {
      console.error(`[Storage] Failed to delete temporary file ${key}:`, err);
    }
    return false;
  }
}
