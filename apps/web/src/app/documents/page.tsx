 "use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Icon } from "../../components/Icon";

type Doc = { id: string; title: string; mimeType: string; createdAt: string };

export default function DocumentsPage() {
  const [items, setItems] = useState<Doc[]>([]);
  const [title, setTitle] = useState("Playbook de Soporte");
  const [content, setContent] = useState(
    "Tickets críticos: responder en <15m, escalar a on-call, confirmar impacto y próximos pasos."
  );
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const res = await fetch("/api/documents");
    if (!res.ok) return;
    setItems(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function create() {
    setLoading(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, mimeType: "text/plain", content }),
      });
      if (res.ok) {
        setTitle("");
        setContent("");
        await refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Documentos"
      subtitle="Centralizá políticas, manuales, playbooks y contratos. Esto alimenta el Chat RAG."
      rightSlot={
        <button className="btn btnPrimary" type="button" onClick={create} disabled={loading}>
          <Icon name="doc" />
          <span style={{ fontSize: 13 }}>{loading ? "Importando..." : "Importar"}</span>
        </button>
      }
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          gap: 12,
        }}
      >
        <div className="card" style={{ padding: 16, borderRadius: 18, minHeight: 320 }}>
          <div style={{ fontWeight: 740, letterSpacing: "-0.02em" }}>Index</div>
          <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
            Docs reales por tenant. Importá uno y probalo en Chat RAG.
          </div>
          <div style={{ height: 12 }} />
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((d) => (
              <div
                key={d.id}
                className="card"
                style={{
                  padding: 12,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
                  <span className="pill">
                    <Icon name="doc" />
                    <span>Doc</span>
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 650,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {d.title}
                    </div>
                    <div className="muted2" style={{ fontSize: 12 }}>
                      {d.mimeType} · {new Date(d.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button className="btn" type="button" onClick={refresh}>
                  <span style={{ fontSize: 13 }}>Sync</span>
                  <Icon name="arrow" />
                </button>
              </div>
            ))}
            {items.length === 0 ? (
              <div className="muted" style={{ padding: 10 }}>
                No hay docs todavía. Importá el primero desde el panel derecho.
              </div>
            ) : null}
          </div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 18, minHeight: 320 }}>
          <div style={{ fontWeight: 740, letterSpacing: "-0.02em" }}>Import</div>
          <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
            Demo: texto plano. En v1: PDF/HTML + chunking + embeddings.
          </div>
          <div style={{ height: 12 }} />
          <div style={{ display: "grid", gap: 10 }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              style={{
                padding: "12px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(0,0,0,0.24)",
                color: "var(--fg)",
                outline: "none",
              }}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenido"
              rows={8}
              style={{
                padding: "12px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(0,0,0,0.24)",
                color: "var(--fg)",
                outline: "none",
                resize: "vertical",
              }}
            />
            <button className="btn btnPrimary" type="button" onClick={create} disabled={loading}>
              <Icon name="doc" />
              <span style={{ fontSize: 13 }}>{loading ? "Guardando..." : "Guardar"}</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

