import { Injectable } from "@nestjs/common";
import { randomUUID, createHmac } from "crypto";
import { PresignedUpload, StorageProvider } from "./storage.types";

@Injectable()
export class S3Service implements StorageProvider {
  private readonly endpoint = process.env.S3_ENDPOINT || "https://s3.us-east-005.backblazeb2.com";
  private readonly region = process.env.S3_REGION || "us-east-005";
  private readonly bucket = process.env.S3_BUCKET || "contentshield-ai-staging";
  private readonly accessKeyId = process.env.S3_ACCESS_KEY_ID;
  private readonly secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  private readonly publicBaseUrl = process.env.S3_PUBLIC_BASE_URL;

  async createPresignedUploadUrl(input: { organizationId: string; fileName: string; mimeType: string }): Promise<PresignedUpload> {
    const sanitized = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `${input.organizationId}/videos/${randomUUID()}-${sanitized}`;
    const expiresIn = Number(process.env.SIGNED_URL_TTL_SECONDS || 900);

    // In a real staging environment, we would use AWS SDK to sign. 
    // For now, we return the URL pointing to our real B2 bucket endpoint.
    // If MOCK_AI_MODE is false, we assume infrastructure is ready for real uploads.
    
    return {
      uploadUrl: `${this.endpoint}/${this.bucket}/${storageKey}`,
      storageKey,
      storageBucket: this.bucket,
      expiresIn
    };
  }

  async getSignedDownloadUrl(storageKey: string): Promise<string> {
    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl}/${storageKey}`;
    }
    return `${this.endpoint}/${this.bucket}/${storageKey}`;
  }

  async deleteObject(storageKey: string): Promise<void> {
    // Implementation for real deletion would go here
    console.log(`Deleting object: ${storageKey}`);
  }
}
