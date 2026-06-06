import { Injectable } from "@nestjs/common";
import { PutObjectCommand, S3Client, DeleteObjectCommand, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { PresignedUpload, StorageProvider } from "./storage.types";

@Injectable()
export class S3Service implements StorageProvider {
  private readonly endpoint = process.env.S3_ENDPOINT || "https://s3.us-west-004.backblazeb2.com";
  private readonly region = process.env.S3_REGION || "us-west-004";
  private readonly bucket = process.env.S3_BUCKET || "contentshield";
  private readonly accessKeyId = process.env.S3_ACCESS_KEY_ID;
  private readonly secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  private readonly publicBaseUrl = process.env.S3_PUBLIC_BASE_URL;
  private readonly client = new S3Client({
    endpoint: this.endpoint,
    region: this.region,
    forcePathStyle: true,
    credentials: this.accessKeyId && this.secretAccessKey ? {
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey
    } : undefined
  });

  async createPresignedUploadUrl(input: { organizationId: string; fileName: string; mimeType: string }): Promise<PresignedUpload> {
    if (!this.accessKeyId || !this.secretAccessKey) {
      throw new Error("S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must be configured for Backblaze uploads.");
    }
    const sanitized = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `${input.organizationId}/videos/${randomUUID()}-${sanitized}`;
    const expiresIn = Number(process.env.SIGNED_URL_TTL_SECONDS || 900);
    const uploadUrl = await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        ContentType: input.mimeType
      }),
      { expiresIn }
    );
    
    return {
      uploadUrl,
      storageKey,
      storageBucket: this.bucket,
      expiresIn
    };
  }

  async getSignedDownloadUrl(storageKey: string): Promise<string> {
    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl}/${storageKey}`;
    }
    return getSignedUrl(this.client, new GetObjectCommand({ Bucket: this.bucket, Key: storageKey }), { expiresIn: Number(process.env.SIGNED_DOWNLOAD_TTL_SECONDS || 900) });
  }

  async objectExists(storageKey: string): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: storageKey }));
      return true;
    } catch {
      return false;
    }
  }

  async deleteObject(storageKey: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: storageKey }));
  }
}
