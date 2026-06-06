import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ok } from "../../common/api-response";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  @Get()
  health() {
    return ok({
      api: "ok",
      redisQueue: "configured",
      storageProvider: "mock-s3-compatible",
      mockAiMode: process.env.MOCK_AI_MODE !== "false"
    });
  }
}
