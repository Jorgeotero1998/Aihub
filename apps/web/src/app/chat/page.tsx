"use client";

import { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import { AppShell } from "../../components/AppShell";
import { Icon } from "../../components/Icon";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [q, setQ] = useState("¿Cuál es la política de soporte para tickets críticos?");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Soy tu copiloto RAG. Preguntame sobre tus documentos y te respondo citando fuentes (demo).",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [rt, setRt] = useState<string>("disconnected");

  const socket = useMemo(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
    return io(`${apiBase}/ws`, { transports: ["websocket"] });
  }, []);

  useEffect(() => {
    function onConnect() {
      setRt("connected");
      const m = document.cookie.match(/(?:^|; )aihub_tenant=([^;]+)/);
      const tenantId = m ? decodeURIComponent(m[1]!) : null;
      if (tenantId) socket.emit("join", { tenantId });
      socket.emit("ping", { t: Date.now() });
    }
    function onDisconnect() {
      setRt("disconnected");
    }
    function onPong() {
      setRt("live");
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("pong", onPong);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("pong", onPong);
      socket.close();
    };
  }, [socket]);

  async function ask() {
    if (!q.trim()) return;
    const next = [...msgs, { role: "user", content: q.trim() } satisfies Msg];
    setMsgs(next);
    setQ("");
    setLoading(true);
    try {
      const res = await fetch("/api/rag/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: next[next.length - 1]!.content }),
      });
      const data = await res.json();
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: data.answer ?? "No response",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Chat con Documentos (RAG)"
      subtitle="Preguntá en lenguaje natural. La plataforma recupera contexto y responde con trazabilidad."
      rightSlot={<span className="pill">Realtime: {rt}</span>}
    >
      <div
        className="card"
        style={{
          padding: 16,
          borderRadius: 18,
          minHeight: 520,
          display: "grid",
          gridTemplateRows: "1fr auto",
          gap: 12,
        }}
      >
        <div style={{ overflow: "auto", paddingRight: 6 }}>
          <div style={{ display: "grid", gap: 10 }}>
            {msgs.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  className="card"
                  style={{
                    maxWidth: "80%",
                    padding: 12,
                    borderRadius: 16,
                    background:
                      m.role === "user"
                        ? "linear-gradient(135deg, rgba(155,123,255,0.30), rgba(51,214,255,0.14))"
                        : "rgba(0,0,0,0.22)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.45,
                  }}
                >
                  <div className="muted2" style={{ fontSize: 12, marginBottom: 6 }}>
                    {m.role === "user" ? "Vos" : "AIhub"}
                  </div>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Preguntá algo a tus documentos…"
            style={{
              padding: "12px 12px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(0,0,0,0.24)",
              color: "var(--fg)",
              outline: "none",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) ask();
            }}
          />
          <button className="btn btnPrimary" type="button" onClick={ask} disabled={loading}>
            <Icon name="spark" />
            <span style={{ fontSize: 13 }}>{loading ? "Pensando..." : "Preguntar"}</span>
          </button>
        </div>
        <div className="muted2" style={{ fontSize: 12 }}>
          Demo: el backend responde con un RAG simple. Al conectar embeddings+pgvector, esto se vuelve “real”.
        </div>
      </div>
    </AppShell>
  );
}

