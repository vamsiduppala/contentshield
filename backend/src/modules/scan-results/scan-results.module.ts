import { Module } from "@nestjs/common";
import { ScanResultsController } from "./scan-results.controller";
import { ScanResultsService } from "./scan-results.service";

@Module({
  controllers: [ScanResultsController],
  providers: [ScanResultsService],
  exports: [ScanResultsService]
})
export class ScanResultsModule {}
