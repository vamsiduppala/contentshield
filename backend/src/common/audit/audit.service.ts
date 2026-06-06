import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  log(event: string, input: { organizationId: string; userId?: string; scanId?: string; videoId?: string; metadata?: Record<string, unknown> }) {
    this.logger.log({ event, ...input });
  }
}
