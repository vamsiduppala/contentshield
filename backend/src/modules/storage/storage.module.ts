import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { StorageService } from "./storage.service";

@Module({
  providers: [S3Service, StorageService],
  exports: [StorageService]
})
export class StorageModule {}
