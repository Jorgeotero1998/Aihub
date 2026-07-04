import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "../prisma/prisma.service";
import { TenantContext } from "../tenancy/tenant.context";
import { Roles } from "../auth/roles";
import { RolesGuard } from "../auth/roles.guard";
import { InMemoryAuthStore } from "../auth/inmemory.store";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("OWNER", "ADMIN")
@Controller("/admin")
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenant: TenantContext,
    private readonly mem: InMemoryAuthStore
  ) {}

  @Get("/tenant")
  async tenantInfo() {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");
    if (!this.prisma.isConnected()) return this.mem.getTenantById(tenantId);
    return await this.prisma.tenant.findUnique({ where: { id: tenantId } });
  }

  @Get("/memberships")
  async memberships() {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");
    if (!this.prisma.isConnected()) return this.mem.listMembershipsByTenant(tenantId);
    return await this.prisma.membership.findMany({
      where: { tenantId },
      include: { user: { select: { id: true, email: true, fullName: true, isActive: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }
}

