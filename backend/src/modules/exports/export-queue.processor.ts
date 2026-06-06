import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { ExportsService } from "./exports.service";

@Processor("editor-export")
export class ExportQueueProcessor extends WorkerHost {
  constructor(private readonly exportsService: ExportsService) {
    super();
  }

  async process(job: Job<{ exportJobId: string }>) {
    await this.exportsService.processEditorExport(job.data.exportJobId);
  }
}
