import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TenantContext } from "../tenancy/tenant.context";
import { DemoStore } from "../demo/demo.store";

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenant: TenantContext,
    private readonly demo: DemoStore
  ) {}

  async list() {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");
    if (!this.prisma.isConnected()) return this.demo.listTasks(tenantId);
    return await this.prisma.task.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
  }

  async create(input: { title: string; dueAt?: string | null }) {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) {
      // In portfolio/demo mode we still require a tenant to avoid leaking data across orgs.
      throw new Error("Missing tenant context");
    }
    if (!this.prisma.isConnected()) {
      return this.demo.createTask(tenantId, {
        title: input.title,
        dueAt: input.dueAt ? new Date(input.dueAt) : null,
      });
    }
    return await this.prisma.task.create({
      data: {
        tenantId,
        title: input.title,
        dueAt: input.dueAt ? new Date(input.dueAt) : null,
      },
    });
  }
}

