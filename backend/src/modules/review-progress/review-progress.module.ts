import { Module } from "@nestjs/common";
import { ReviewProgressService } from "./review-progress.service";

@Module({
  providers: [ReviewProgressService],
  exports: [ReviewProgressService]
})
export class ReviewProgressModule {}
