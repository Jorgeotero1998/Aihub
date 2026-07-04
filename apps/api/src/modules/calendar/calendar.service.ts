import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TenantContext } from "../tenancy/tenant.context";
import { DemoStore } from "../demo/demo.store";

@Injectable()
export class CalendarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenant: TenantContext,
    private readonly demo: DemoStore
  ) {}

  async list() {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");
    if (!this.prisma.isConnected()) return this.demo.listEvents(tenantId);
    return await this.prisma.calendarEvent.findMany({
      where: { tenantId },
      orderBy: { startAt: "asc" },
      take: 50,
    });
  }

  async create(input: { title: string; startAt: string; endAt: string; kind?: string }) {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");
    if (!this.prisma.isConnected()) {
      return this.demo.createEvent(tenantId, {
        title: input.title,
        startAt: new Date(input.startAt),
        endAt: new Date(input.endAt),
        kind: input.kind ?? "meeting",
      });
    }
    return await this.prisma.calendarEvent.create({
      data: {
        tenantId,
        title: input.title,
        startAt: new Date(input.startAt),
        endAt: new Date(input.endAt),
        kind: input.kind ?? "meeting",
      },
    });
  }
}

