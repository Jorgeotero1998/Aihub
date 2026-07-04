import { Injectable } from "@nestjs/common";
import { DemoStore } from "../demo/demo.store";
import { PrismaService } from "../prisma/prisma.service";
import { TenantContext } from "../tenancy/tenant.context";

@Injectable()
export class AgentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenant: TenantContext,
    private readonly demo: DemoStore
  ) {}

  async run(agentId: string, message: string) {
    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");

    const msg = (message ?? "").trim();
    if (!msg) return { answer: "Escribí un mensaje para el agente.", agentId };

    const docs = this.prisma.isConnected()
      ? await this.prisma.document.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" }, take: 3 })
      : this.demo.listDocs(tenantId).slice(0, 3);

    const ctx = docs.map((d) => `${d.title}: ${d.content.slice(0, 220)}`).join("\n");

    const header =
      agentId === "support"
        ? "Agente Soporte"
        : agentId === "sales"
          ? "Agente Ventas"
          : agentId === "hr"
            ? "Agente RR.HH."
            : "Agente";

    const play =
      agentId === "support"
        ? "Acción sugerida: clasificar severidad, confirmar impacto, definir próximos pasos, escalar si SLA."
        : agentId === "sales"
          ? "Acción sugerida: calificar lead, redactar propuesta, preparar follow-up y forecast."
          : agentId === "hr"
            ? "Acción sugerida: resumen de candidato, preguntas de entrevista, checklist de onboarding."
            : "Acción sugerida: estructurar la tarea y proponer pasos.";

    const answer =
      `${header} (demo):\n\n` +
      `Tu mensaje: ${msg}\n\n` +
      `${play}\n\n` +
      (ctx ? `Contexto interno (docs):\n${ctx}` : "Sin docs aún. Creá documentos para enriquecer respuestas.");

    return { agentId, answer };
  }
}

