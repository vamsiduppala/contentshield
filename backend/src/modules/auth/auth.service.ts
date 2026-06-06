import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { randomBytes, scryptSync, createHmac, timingSafeEqual } from "node:crypto";
import { SubscriptionPlan } from "@prisma/client";

@Injectable()
export class AuthService {
  private readonly accessSecret = process.env.JWT_ACCESS_SECRET || "access-fallback-secret";
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh-fallback-secret";

  constructor(private readonly prisma: PrismaService) {}

  private hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
    const hash = scryptSync(password, salt, 64).toString("hex");
    return { salt, hash };
  }

  private verifyPassword(password: string, salt: string, storedHash: string) {
    const hash = scryptSync(password, salt, 64);
    const stored = Buffer.from(storedHash, "hex");
    return stored.length === hash.length && timingSafeEqual(stored, hash);
  }

  private generateToken(payload: any, secret: string, expiresInMinutes: number) {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const exp = Math.floor(Date.now() / 1000) + (expiresInMinutes * 60);
    const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
    const signature = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
    return `${header}.${body}.${signature}`;
  }

  private verifyToken(token: string, secret: string) {
    try {
      const [header, body, signature] = token.split(".");
      const expectedSignature = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
      if (signature !== expectedSignature) return null;
      
      const payload = JSON.parse(Buffer.from(body, "base64url").toString());
      if (payload.exp < Date.now() / 1000) return null;
      
      return payload;
    } catch {
      return null;
    }
  }

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email }, include: { organization: true } });
    if (!user || !this.verifyPassword(pass, user.salt, user.passwordHash)) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: user.id, org: user.organizationId, email: user.email };
    return {
      accessToken: this.generateToken(payload, this.accessSecret, 60), // 1 hour
      refreshToken: this.generateToken(payload, this.refreshSecret, 10080), // 1 week
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organization: user.organization
      }
    };
  }

  async signup(data: any) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException("Email already exists");

    const { salt, hash } = this.hashPassword(data.password);

    // Auto-create organization for new users if not provided
    const org = await this.prisma.organization.create({
      data: {
        name: `${data.firstName}'s Studio`,
        slug: `${data.firstName.toLowerCase()}-${randomBytes(4).toString("hex")}`,
        plan: SubscriptionPlan.free
      }
    });

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hash,
        salt,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "owner",
        organizationId: org.id
      },
      include: { organization: true }
    });

    return this.login(data.email, data.password);
  }

  async validateAccessToken(token: string) {
    const payload = this.verifyToken(token, this.accessSecret);
    if (!payload) return null;
    
    return this.prisma.user.findUnique({ 
      where: { id: payload.sub },
      include: { organization: true }
    });
  }
}
