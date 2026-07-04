 "use client";

import { useMemo, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Icon } from "../../components/Icon";

const agents = [
  {
    id: "support",
    title: "Agente de Soporte",
    desc: "Resuelve tickets, redacta respuestas, detecta urgencias y sugiere acciones.",
    color:
      "radial-gradient(600px 260px at 30% 20%, rgba(51,214,255,0.26), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  },
  {
    id: "sales",
    title: "Agente de Ventas",
    desc: "Califica leads, redacta propuestas, prepara follow-ups y forecast.",
    color:
      "radial-gradient(600px 260px at 30% 20%, rgba(155,123,255,0.26), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  },
  {
    id: "hr",
    title: "Agente de RR. HH.",
    desc: "Screening, templates de entrevistas, resúmenes y onboarding.",
    color:
      "radial-gradient(600px 260px at 30% 20%, rgba(255,59,212,0.22), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  },
];

export default function AgentsPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("Necesito una respuesta para un ticket crítico.");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<{ role: "user" | "agent"; content: string }[]>([
    { role: "agent", content: "Elegí un agente y escribime. Respondo usando contexto del tenant (demo)." },
  ]);

  const current = useMemo(() => agents.find((a) => a.id === open) ?? null, [open]);

  async function send() {
    if (!current) return;
    const msg = q.trim();
    if (!msg) return;
    setLog((l) => [...l, { role: "user", content: msg }]);
    setQ("");
    setBusy(true);
    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agentId: current.id, message: msg }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      const data = JSON.parse(text);
      setLog((l) => [...l, { role: "agent", content: data.answer ?? "OK" }]);
    } catch (e) {
      setLog((l) => [
        ...l,
        { role: "agent", content: `Error: ${e instanceof Error ? e.message : "fetch failed"}` },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell
      title="Agentes IA"
      subtitle="Agentes especializados con herramientas. Listos para conectarse a tus flujos (CRM, Helpdesk, HRIS)."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 420px",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {agents.map((a) => (
            <div
              key={a.id}
              className="card"
              style={{
                padding: 16,
                borderRadius: 18,
                background: a.color,
                minHeight: 220,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="pill" style={{ width: "fit-content" }}>
                <Icon name="spark" />
                <span>Specialized</span>
              </div>
              <div style={{ height: 10 }} />
              <div style={{ fontSize: 18, fontWeight: 760, letterSpacing: "-0.03em" }}>{a.title}</div>
              <div className="muted" style={{ marginTop: 8 }}>
                {a.desc}
              </div>
              <div style={{ height: 14 }} />
              <button className="btn btnPrimary" type="button" onClick={() => setOpen(a.id)}>
                <Icon name="chat" />
                <span style={{ fontSize: 13 }}>Abrir consola</span>
              </button>

              <div
                style={{
                  position: "absolute",
                  right: -24,
                  bottom: -24,
                  width: 160,
                  height: 160,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  filter: "blur(0px)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              />
            </div>
          ))}
        </div>

        <div
          className="card"
          style={{
            padding: 16,
            borderRadius: 18,
            minHeight: 360,
            display: "grid",
            gridTemplateRows: "auto 1fr auto",
            gap: 10,
            background: "rgba(0,0,0,0.18)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 760, letterSpacing: "-0.02em" }}>Consola</div>
              <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
                {current ? current.title : "Seleccioná un agente"}
              </div>
            </div>
            <button className="btn" type="button" onClick={() => setOpen(null)}>
              <Icon name="arrow" />
              <span style={{ fontSize: 13 }}>Cerrar</span>
            </button>
          </div>

          <div style={{ overflow: "auto", paddingRight: 6, display: "grid", gap: 10 }}>
            {log.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  className="card"
                  style={{
                    maxWidth: "95%",
                    padding: 12,
                    borderRadius: 16,
                    background:
                      m.role === "user"
                        ? "linear-gradient(135deg, rgba(124,58,237,0.26), rgba(6,182,212,0.10))"
                        : "rgba(0,0,0,0.22)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.45,
                  }}
                >
                  <div className="muted2" style={{ fontSize: 12, marginBottom: 6 }}>
                    {m.role === "user" ? "Vos" : current ? current.id : "agent"}
                  </div>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Escribí al agente…"
              style={{
                padding: "12px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(0,0,0,0.24)",
                color: "var(--fg)",
                outline: "none",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) send();
              }}
              disabled={!current || busy}
            />
            <button className="btn btnPrimary" type="button" onClick={send} disabled={!current || busy}>
              <Icon name="spark" />
              <span style={{ fontSize: 13 }}>{busy ? "Pensando..." : "Enviar"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 16, borderRadius: 18 }}>
        <div style={{ fontWeight: 740, letterSpacing: "-0.02em" }}>Roadmap de herramientas</div>
        <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
          Conectores típicos para que el agente no sea solo “chat”.
        </div>
        <div style={{ height: 12 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["Helpdesk", "CRM", "Email", "Docs", "Calendar", "Billing", "Slack/Teams", "DB"].map((x) => (
            <span key={x} className="pill">
              <Icon name="bolt" />
              <span>{x}</span>
            </span>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

