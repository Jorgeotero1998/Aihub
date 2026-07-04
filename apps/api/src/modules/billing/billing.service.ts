import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TenantContext } from "../tenancy/tenant.context";
import { DemoStore } from "../demo/demo.store";

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenant: TenantContext,
    private readonly demo: DemoStore
  ) {}

  async getOrCreate() {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");

    if (!this.prisma.isConnected()) {
      // Demo subscription (in-memory)
      return {
        id: `demo-${tenantId}`,
        tenantId,
        provider: "stripe",
        status: "inactive",
        plan: "free",
        currentPeriodEnd: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const existing = await this.prisma.subscription.findUnique({ where: { tenantId } });
    if (existing) return existing;

    return await this.prisma.subscription.create({
      data: { tenantId, status: "inactive", plan: "free", provider: "stripe" },
    });
  }

  async checkout(plan: string) {
    
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");

    const sub = await this.getOrCreate();
    const normalized = ["free", "pro", "enterprise"].includes(plan) ? plan : "pro";

    
    return {
      ok: true,
      provider: sub.provider,
      plan: normalized,
      url: "https://example.com/checkout (set STRIPE_SECRET_KEY to enable real checkout)",
    };
  }
}

