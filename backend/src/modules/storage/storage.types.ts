export interface PresignedUpload {
  uploadUrl: string;
  storageKey: string;
  storageBucket: string;
  expiresIn: number;
}

export interface StorageProvider {
  createPresignedUploadUrl(input: { organizationId: string; fileName: string; mimeType: string }): Promise<PresignedUpload>;
  getSignedDownloadUrl(storageKey: string): Promise<string>;
  deleteObject(storageKey: string): Promise<void>;
}
