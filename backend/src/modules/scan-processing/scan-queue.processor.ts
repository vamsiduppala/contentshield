import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { ScanOrchestratorService } from "./scan-orchestrator.service";

@Processor("scan")
export class ScanQueueProcessor extends WorkerHost {
  constructor(private readonly orchestrator: ScanOrchestratorService) {
    super();
  }

  async process(job: Job<{ scanId: string }>) {
    if (job.name === "scan.process") {
      await this.orchestrator.process(job.data.scanId);
    }
  }
}
