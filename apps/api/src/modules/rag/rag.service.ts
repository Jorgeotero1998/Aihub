import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TenantContext } from "../tenancy/tenant.context";
import { DemoStore } from "../demo/demo.store";

@Injectable()
export class RagService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenant: TenantContext,
    private readonly demo: DemoStore
  ) {}

  async ask(question: string) {
    const q = (question ?? "").trim();
    if (!q) return { answer: "Hacé una pregunta para consultar los documentos.", sources: [] };

    // Simple demo retrieval: find documents containing any token from the question.
    const tokens = q
      .toLowerCase()
      .split(/[\s,.!?;:()]+/)
      .filter((t) => t.length >= 4)
      .slice(0, 8);

    const tenantId = this.tenant.tenantId;
    if (!tenantId) throw new Error("Missing tenant context");

    const docs = this.prisma.isConnected()
      ? await this.prisma.document.findMany({
          where: { tenantId },
          take: 5,
          orderBy: { createdAt: "desc" },
        })
      : this.demo.listDocs(tenantId).slice(0, 5);

    const scored = docs
      .map((d) => {
        const hay = `${d.title}\n${d.content}`.toLowerCase();
        const score = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
        return { d, score };
      })
      .sort((a, b) => b.score - a.score)
      .filter((x) => x.score > 0)
      .slice(0, 3);

    const sources = scored.map((x) => ({
      id: x.d.id,
      title: x.d.title,
      score: x.score,
    }));

    const context = scored.map((x) => `- ${x.d.title}: ${x.d.content.slice(0, 400)}`).join("\n");

    const answer =
      `Respuesta (demo RAG):\n\n` +
      `Según los documentos más relevantes, la guía sugiere:\n` +
      `1) Priorizar lo crítico.\n2) Responder con claridad y próximos pasos.\n3) Escalar si hay SLA comprometido.\n\n` +
      `Pregunta: ${q}\n\n` +
      (context ? `Contexto usado:\n${context}` : "No encontré documentos relevantes aún. Importá docs en el módulo Documentos.");

    return { answer, sources };
  }
}

