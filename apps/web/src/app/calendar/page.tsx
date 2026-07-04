"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Icon } from "../../components/Icon";

type Ev = { id: string; title: string; startAt: string; endAt: string; kind: string };

export default function CalendarPage() {
  const [items, setItems] = useState<Ev[]>([]);
  const [title, setTitle] = useState("Weekly Ops Sync");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const res = await fetch("/api/calendar/events");
    if (!res.ok) return;
    setItems(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function create() {
    setLoading(true);
    try {
      const start = new Date(Date.now() + 60 * 60 * 1000);
      const end = new Date(start.getTime() + 45 * 60 * 1000);
      const res = await fetch("/api/calendar/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          startAt: start.toISOString(),
          endAt: end.toISOString(),
          kind: "meeting",
        }),
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
      title="Calendario"
      subtitle="Reuniones, deadlines y eventos. Ideal para orquestar automatizaciones y recordatorios."
      rightSlot={
        <button className="btn btnPrimary" type="button" onClick={create} disabled={loading}>
          <Icon name="calendar" />
          <span style={{ fontSize: 13 }}>{loading ? "Agendando..." : "Agendar"}</span>
        </button>
      }
    >
      <div className="card" style={{ padding: 16, borderRadius: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nuevo evento…"
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
        <div style={{ fontWeight: 740, letterSpacing: "-0.02em" }}>Timeline</div>
        <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
          Próximos eventos para tu tenant.
        </div>
        <div style={{ height: 12 }} />
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((e) => (
            <div
              key={e.id}
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
                <div style={{ fontWeight: 650 }}>{e.title}</div>
                <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
                  {new Date(e.startAt).toLocaleString()} → {new Date(e.endAt).toLocaleString()}
                </div>
              </div>
              <span className="pill">
                <Icon name="spark" />
                <span>{e.kind}</span>
              </span>
            </div>
          ))}
          {items.length === 0 ? (
            <div className="muted" style={{ padding: 10 }}>
              No hay eventos aún. Creá uno arriba.
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}

