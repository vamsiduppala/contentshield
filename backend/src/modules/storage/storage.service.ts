import { Injectable } from "@nestjs/common";
import { S3Service } from "./s3.service";

@Injectable()
export class StorageService {
  constructor(private readonly provider: S3Service) {}

  createPresignedUploadUrl(input: { organizationId: string; fileName: string; mimeType: string }) {
    return this.provider.createPresignedUploadUrl(input);
  }

  getSignedDownloadUrl(storageKey: string) {
    return this.provider.getSignedDownloadUrl(storageKey);
  }

  objectExists(storageKey: string) {
    return this.provider.objectExists(storageKey);
  }

  putObject(input: { storageKey: string; content: string | Buffer; mimeType: string }) {
    return this.provider.putObject(input);
  }
}
