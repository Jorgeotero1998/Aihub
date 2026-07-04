import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TenantContext } from "../tenancy/tenant.context";
import { DemoStore } from "../demo/demo.store";

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenant: TenantContext,
    private readonly demo: DemoStore
  ) {}

  async overview() {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");

    if (!this.prisma.isConnected()) {
      const counts = this.demo.counts(tenantId);
      return { ...counts, generatedAt: new Date().toISOString(), mode: "demo" };
    }

    const [tasks, docs, events, unread] = await Promise.all([
      this.prisma.task.count({ where: { tenantId } }),
      this.prisma.document.count({ where: { tenantId } }),
      this.prisma.calendarEvent.count({ where: { tenantId } }),
      this.prisma.notification.count({
        where: { tenantId, readAt: null },
      }),
    ]);

    return {
      tasks,
      documents: docs,
      calendarEvents: events,
      unreadNotifications: unread,
      generatedAt: new Date().toISOString(),
      mode: "db",
    };
  }
}

