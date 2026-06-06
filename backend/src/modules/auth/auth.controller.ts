import { Controller, Post, Body, Get, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Login with email and password" })
  async login(@Body() body: any) {
    return { success: true, data: await this.authService.login(body.email, body.password) };
  }

  @Post("signup")
  @ApiOperation({ summary: "Register a new user and organization" })
  async signup(@Body() body: any) {
    return { success: true, data: await this.authService.signup(body) };
  }

  @Get("demo")
  @ApiOperation({ summary: "Get demo credentials" })
  async getDemo() {
    return { 
      success: true, 
      data: { 
        email: "maya@contentshield.ai", 
        password: "MayaDemo@2026",
        note: "Staging demo account"
      } 
    };
  }
}
