import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto, RegisterDto } from "./dto";
import { InMemoryAuthStore } from "./inmemory.store";

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mem: InMemoryAuthStore
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    if (!this.prisma.isConnected()) {
      // Demo mode without DB
      try {
        const tenant = this.mem.createTenant({ name: dto.tenantName, slug: dto.tenantSlug });
        const user = this.mem.createUser({ email: dto.email, passwordHash, fullName: dto.fullName });
        this.mem.createMembership({ tenantId: tenant.id, userId: user.id, role: "OWNER" });
        return this.issueTokens({ userId: user.id, email: user.email, tenantId: tenant.id, role: "OWNER" });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Register failed";
        throw new BadRequestException(msg);
      }
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException("Email already in use");

    const tenant = await this.prisma.tenant.create({ data: { name: dto.tenantName, slug: dto.tenantSlug } });
    const user = await this.prisma.user.create({ data: { email: dto.email, passwordHash, fullName: dto.fullName } });
    await this.prisma.membership.create({ data: { tenantId: tenant.id, userId: user.id, role: "OWNER" } });

    return this.issueTokens({ userId: user.id, email: user.email, tenantId: tenant.id, role: "OWNER" });
  }

  async login(dto: LoginDto) {
    if (!this.prisma.isConnected()) {
      const user = this.mem.findUserByEmail(dto.email);
      if (!user || !user.isActive) throw new UnauthorizedException("Invalid credentials");
      const ok = await bcrypt.compare(dto.password, user.passwordHash);
      if (!ok) throw new UnauthorizedException("Invalid credentials");
      const membership = (dto.tenantId ? user.memberships.find((m) => m.tenantId === dto.tenantId) : null) ?? user.memberships[0];
      if (!membership) throw new UnauthorizedException("No tenant membership");
      return this.issueTokens({ userId: user.id, email: user.email, tenantId: membership.tenantId, role: membership.role });
    }

    const user = await this.prisma.user.findUnique({ where: { email: dto.email }, include: { memberships: true } });
    if (!user || !user.isActive) throw new UnauthorizedException("Invalid credentials");
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    const membership = (dto.tenantId ? user.memberships.find((m) => m.tenantId === dto.tenantId) : null) ?? user.memberships[0];
    if (!membership) throw new UnauthorizedException("No tenant membership");
    return this.issueTokens({ userId: user.id, email: user.email, tenantId: membership.tenantId, role: membership.role });
  }

  issueTokens(payload: { userId: string; email: string; tenantId: string; role: string }) {
    const accessTtl = Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900);
    const refreshTtl = Number(process.env.JWT_REFRESH_TTL_SECONDS ?? 1209600);
    const secret = process.env.JWT_SECRET ?? "dev-secret";

    const base = {
      sub: payload.userId,
      email: payload.email,
      tenantId: payload.tenantId,
      role: payload.role,
    };

    const accessToken = this.jwt.sign(base, {
      secret,
      expiresIn: accessTtl,
    });
    const refreshToken = this.jwt.sign({ ...base, type: "refresh" }, { secret, expiresIn: refreshTtl });

    return {
      accessToken,
      refreshToken,
      expiresAt: nowSeconds() + accessTtl,
      tenantId: payload.tenantId,
      role: payload.role,
    };
  }
}

