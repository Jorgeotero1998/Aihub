import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import { TenantContext } from "../tenancy/tenant.context";
import { DemoStore } from "../demo/demo.store";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenant: TenantContext,
    private readonly realtime: RealtimeGateway,
    private readonly demo: DemoStore
  ) {}

  async list() {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");
    if (!this.prisma.isConnected()) return this.demo.listNotifs(tenantId);
    return await this.prisma.notification.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
  }

  async create(input: { type: string; title: string; body?: string }) {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");

    const n = this.prisma.isConnected()
      ? await this.prisma.notification.create({
          data: {
            tenantId,
            type: input.type,
            title: input.title,
            body: input.body,
          },
        })
      : this.demo.createNotif(tenantId, input);

    this.realtime.server.to(`tenant:${tenantId}`).emit("notification", {
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      createdAt: n.createdAt,
    });

    return n;
  }
}

