"use client";

import { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import Link from "next/link";
import { Icon } from "../../components/Icon";

type Notif = { id: string; title: string; body?: string; createdAt: string | Date };

export default function DashboardClient({ tenantId }: { tenantId: string }) {
  const [rt, setRt] = useState<"disconnected" | "connected" | "live">("disconnected");
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [busy, setBusy] = useState(false);

  const socket = useMemo(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
    return io(`${apiBase}/ws`, { transports: ["websocket"] });
  }, []);

  async function refreshNotifs() {
    const res = await fetch("/api/notifications", { cache: "no-store" });
    if (!res.ok) return;
    setNotifs(await res.json());
  }

  useEffect(() => {
    refreshNotifs();
  }, []);

  useEffect(() => {
    function onConnect() {
      setRt("connected");
      socket.emit("join", { tenantId });
      socket.emit("ping", { t: Date.now() });
    }
    function onDisconnect() {
      setRt("disconnected");
    }
    function onPong() {
      setRt("live");
    }
    function onNotif(n: any) {
      setNotifs((prev) => [{ ...n, createdAt: n.createdAt ?? new Date().toISOString() }, ...prev].slice(0, 20));
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("pong", onPong);
    socket.on("notification", onNotif);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("pong", onPong);
      socket.off("notification", onNotif);
      socket.close();
    };
  }, [socket, tenantId]);

  async function sendTestNotif() {
    setBusy(true);
    try {
      await fetch("/api/notifications/test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Realtime OK", body: "Esta notificación llegó en vivo al dashboard." }),
      });
      await refreshNotifs();
    } finally {
      setBusy(false);
    }
  }

  async function seedDoc() {
    setBusy(true);
    try {
      await fetch("/api/documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "Política de Soporte (SLA)",
          mimeType: "text/plain",
          content:
            "SLA: crítico <15m, alto <1h, medio <4h. Siempre confirmar impacto, owner y próximos pasos. Escalar si riesgo.",
        }),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="card"
      style={{
        padding: 14,
        borderRadius: 18,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 380px",
        gap: 12,
        background:
          "radial-gradient(900px 320px at 15% 20%, rgba(124,58,237,0.20), transparent 60%), radial-gradient(900px 320px at 90% 65%, rgba(6,182,212,0.12), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 780, letterSpacing: "-0.02em" }}>Command Deck</div>
            <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
              Botones reales: crean data, disparan realtime, y conectan módulos.
            </div>
          </div>
          <span className="pill">Realtime: {rt}</span>
        </div>

        <div style={{ height: 12 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button className="btn btnPrimary" type="button" onClick={sendTestNotif} disabled={busy}>
            <Icon name="bell" />
            <span style={{ fontSize: 13 }}>{busy ? "..." : "Probar notificación"}</span>
          </button>
          <button className="btn" type="button" onClick={seedDoc} disabled={busy}>
            <Icon name="doc" />
            <span style={{ fontSize: 13 }}>Crear doc demo</span>
          </button>
          <Link className="btn" href="/documents">
            <Icon name="arrow" />
            <span style={{ fontSize: 13 }}>Abrir documentos</span>
          </Link>
          <Link className="btn" href="/chat">
            <Icon name="spark" />
            <span style={{ fontSize: 13 }}>Ir al RAG</span>
          </Link>
        </div>

        <div style={{ height: 12 }} />
        <div className="muted2" style={{ fontSize: 12 }}>
          Tip: después de “Crear doc demo”, preguntá en Chat: “¿Cuál es el SLA para tickets críticos?”.
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 740, letterSpacing: "-0.02em" }}>Live notifications</div>
          <button className="btn" type="button" onClick={refreshNotifs}>
            <Icon name="grid" />
            <span style={{ fontSize: 13 }}>Sync</span>
          </button>
        </div>
        <div style={{ height: 10 }} />
        <div style={{ display: "grid", gap: 10, maxHeight: 220, overflow: "auto", paddingRight: 6 }}>
          {notifs.slice(0, 8).map((n) => (
            <div
              key={n.id}
              className="card"
              style={{
                padding: 12,
                borderRadius: 16,
                background: "rgba(0,0,0,0.20)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 650, letterSpacing: "-0.01em" }}>{n.title}</div>
                <span className="muted2" style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                  {new Date(n.createdAt).toLocaleTimeString()}
                </span>
              </div>
              {n.body ? (
                <div className="muted" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.45 }}>
                  {n.body}
                </div>
              ) : null}
            </div>
          ))}
          {notifs.length === 0 ? <div className="muted">Sin notificaciones aún.</div> : null}
        </div>
      </div>
    </div>
  );
}

