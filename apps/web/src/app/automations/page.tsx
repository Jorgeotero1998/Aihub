"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Icon } from "../../components/Icon";

type Task = { id: string; title: string; status: string; dueAt: string | null };

export default function AutomationsPage() {
  const [items, setItems] = useState<Task[]>([]);
  const [title, setTitle] = useState("Generar resumen diario de soporte");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const res = await fetch("/api/tasks");
    if (!res.ok) return;
    setItems(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function create() {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        setTitle("");
        await refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Automatizaciones"
      subtitle="Workflows y tareas recurrentes. En demo se modelan como tareas con due dates y triggers."
      rightSlot={
        <button className="btn btnPrimary" type="button" onClick={create} disabled={loading}>
          <Icon name="bolt" />
          <span style={{ fontSize: 13 }}>{loading ? "Creando..." : "Crear"}</span>
        </button>
      }
    >
      <div className="card" style={{ padding: 16, borderRadius: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nueva automation…"
            style={{
              padding: "12px 12px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(0,0,0,0.24)",
              color: "var(--fg)",
              outline: "none",
            }}
          />
          <button className="btn" type="button" onClick={refresh}>
            <Icon name="grid" />
            <span style={{ fontSize: 13 }}>Refresh</span>
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 16, borderRadius: 18 }}>
        <div style={{ fontWeight: 740, letterSpacing: "-0.02em" }}>Automations</div>
        <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
          Las que están creadas para tu tenant.
        </div>
        <div style={{ height: 12 }} />
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((t) => (
            <div
              key={t.id}
              className="card"
              style={{
                padding: 12,
                borderRadius: 16,
                background: "rgba(0,0,0,0.20)",
                border: "1px solid rgba(255,255,255,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 650, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {t.title}
                </div>
                <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
                  Status: {t.status}
                </div>
              </div>
              <span className="pill">
                <Icon name="spark" />
                <span>Ready</span>
              </span>
            </div>
          ))}
          {items.length === 0 ? (
            <div className="muted" style={{ padding: 10 }}>
              No hay automations aún. Creá una arriba.
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}

