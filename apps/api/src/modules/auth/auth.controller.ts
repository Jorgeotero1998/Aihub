import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { PrismaService } from "../prisma/prisma.service";
import { TenancyService } from "../tenancy/tenancy.service";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";
import { JwtUser } from "./jwt.strategy";
import { InMemoryAuthStore } from "./inmemory.store";

@ApiTags("auth")
@Controller("/auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly tenancy: TenancyService,
    private readonly prisma: PrismaService,
    private readonly mem: InMemoryAuthStore
  ) {}

  @Post("/register")
  async register(@Body() dto: RegisterDto) {
    return await this.auth.register(dto);
  }

  @Post("/login")
  async login(@Body() dto: LoginDto) {
    return await this.auth.login(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("/me")
  async me(@Req() req: Request) {
    const user = req.user as JwtUser;

    const tenantId = this.tenancy.getTenantIdFromRequest(req) ?? user.tenantId;
    await this.prisma.setTenant(tenantId);

    if (!this.prisma.isConnected()) {
      const u = this.mem.findUserById(user.sub);
      return { user: u, tenantId, role: user.role };
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { id: true, email: true, fullName: true, isActive: true, createdAt: true },
    });

    return { user: dbUser, tenantId, role: user.role };
  }
}

