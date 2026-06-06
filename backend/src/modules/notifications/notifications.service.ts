import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async scanCompleted(scanId: string, organizationId: string) {
    this.logger.log({ event: "scan.completed", scanId, organizationId });
  }
}
