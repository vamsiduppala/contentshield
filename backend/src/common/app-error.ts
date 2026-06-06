import { HttpException, HttpStatus } from "@nestjs/common";

export class AppError extends HttpException {
  constructor(code: string, message: string, status: HttpStatus | number = HttpStatus.BAD_REQUEST) {
    super({ success: false, error: { code, message } }, status);
  }
}
