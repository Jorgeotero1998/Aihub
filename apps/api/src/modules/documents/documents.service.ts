import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TenantContext } from "../tenancy/tenant.context";
import { DemoStore } from "../demo/demo.store";

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenant: TenantContext,
    private readonly demo: DemoStore
  ) {}

  async list() {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");
    if (!this.prisma.isConnected()) return this.demo.listDocs(tenantId);
    return await this.prisma.document.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async create(input: { title: string; mimeType?: string; content: string }) {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");
    if (!this.prisma.isConnected()) {
      return this.demo.createDoc(tenantId, {
        title: input.title,
        mimeType: input.mimeType ?? "text/plain",
        content: input.content,
      });
    }
    return await this.prisma.document.create({
      data: {
        tenantId,
        title: input.title,
        mimeType: input.mimeType ?? "text/plain",
        content: input.content,
      },
    });
  }
}

