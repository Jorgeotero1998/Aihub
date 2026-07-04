import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

type Task = { id: string; tenantId: string; title: string; status: string; dueAt: Date | null; createdAt: Date; updatedAt: Date };
type Doc = { id: string; tenantId: string; title: string; mimeType: string; content: string; createdAt: Date };
type Event = { id: string; tenantId: string; title: string; startAt: Date; endAt: Date; kind: string; createdAt: Date };
type Notif = { id: string; tenantId: string; type: string; title: string; body?: string; readAt: Date | null; createdAt: Date };

@Injectable()
export class DemoStore {
  private seededTenants = new Set<string>();
  private tasks: Task[] = [];
  private docs: Doc[] = [];
  private events: Event[] = [];
  private notifs: Notif[] = [];

  ensureSeed(tenantId: string) {
    if (this.seededTenants.has(tenantId)) return;
    this.seededTenants.add(tenantId);

    const now = Date.now();

    this.docs.push(
      {
        id: randomUUID(),
        tenantId,
        title: "Playbook de Soporte",
        mimeType: "text/plain",
        content:
          "Tickets críticos: responder en <15m, escalar a on-call, confirmar impacto, definir próximos pasos y actualizar cada 30m.",
        createdAt: new Date(now - 2 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        tenantId,
        title: "Pitch de Ventas",
        mimeType: "text/plain",
        content:
          "Propuesta: reducir tiempos operativos con agentes IA y RAG. Enfatizar quick wins, seguridad y multi-tenant.",
        createdAt: new Date(now - 6 * 60 * 60 * 1000),
      }
    );

    this.tasks.push(
      {
        id: randomUUID(),
        tenantId,
        title: "Generar resumen diario de soporte",
        status: "todo",
        dueAt: new Date(now + 4 * 60 * 60 * 1000),
        createdAt: new Date(now - 30 * 60 * 1000),
        updatedAt: new Date(now - 30 * 60 * 1000),
      },
      {
        id: randomUUID(),
        tenantId,
        title: "Forecast ventas (semanal)",
        status: "todo",
        dueAt: new Date(now + 24 * 60 * 60 * 1000),
        createdAt: new Date(now - 2 * 60 * 60 * 1000),
        updatedAt: new Date(now - 2 * 60 * 60 * 1000),
      }
    );

    const start = new Date(now + 60 * 60 * 1000);
    const end = new Date(now + 105 * 60 * 1000);
    this.events.push({
      id: randomUUID(),
      tenantId,
      title: "Weekly Ops Sync",
      startAt: start,
      endAt: end,
      kind: "meeting",
      createdAt: new Date(now - 60 * 60 * 1000),
    });

    this.notifs.push({
      id: randomUUID(),
      tenantId,
      type: "system",
      title: "AIhub listo",
      body: "Estás en demo mode (sin DB). Podés navegar y probar módulos.",
      readAt: null,
      createdAt: new Date(now - 10 * 60 * 1000),
    });
  }

  listDocs(tenantId: string) {
    this.ensureSeed(tenantId);
    return this.docs.filter((d) => d.tenantId === tenantId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  createDoc(tenantId: string, input: { title: string; mimeType: string; content: string }) {
    const d: Doc = { id: randomUUID(), tenantId, title: input.title, mimeType: input.mimeType, content: input.content, createdAt: new Date() };
    this.docs.push(d);
    return d;
  }

  listTasks(tenantId: string) {
    this.ensureSeed(tenantId);
    return this.tasks.filter((t) => t.tenantId === tenantId).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  createTask(tenantId: string, input: { title: string; dueAt: Date | null }) {
    const now = new Date();
    const t: Task = { id: randomUUID(), tenantId, title: input.title, status: "todo", dueAt: input.dueAt, createdAt: now, updatedAt: now };
    this.tasks.push(t);
    return t;
  }

  listEvents(tenantId: string) {
    this.ensureSeed(tenantId);
    return this.events.filter((e) => e.tenantId === tenantId).sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
  }
  createEvent(tenantId: string, input: { title: string; startAt: Date; endAt: Date; kind: string }) {
    const e: Event = { id: randomUUID(), tenantId, title: input.title, startAt: input.startAt, endAt: input.endAt, kind: input.kind, createdAt: new Date() };
    this.events.push(e);
    return e;
  }

  listNotifs(tenantId: string) {
    this.ensureSeed(tenantId);
    return this.notifs.filter((n) => n.tenantId === tenantId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  createNotif(tenantId: string, input: { type: string; title: string; body?: string }) {
    const n: Notif = { id: randomUUID(), tenantId, type: input.type, title: input.title, body: input.body, readAt: null, createdAt: new Date() };
    this.notifs.push(n);
    return n;
  }

  counts(tenantId: string) {
    this.ensureSeed(tenantId);
    const tasks = this.tasks.filter((t) => t.tenantId === tenantId).length;
    const documents = this.docs.filter((d) => d.tenantId === tenantId).length;
    const calendarEvents = this.events.filter((e) => e.tenantId === tenantId).length;
    const unreadNotifications = this.notifs.filter((n) => n.tenantId === tenantId && !n.readAt).length;
    return { tasks, documents, calendarEvents, unreadNotifications };
  }
}

