import Link from "next/link";
import { Icon } from "../components/Icon";

export default function HomePage() {
  return (
    <main className="container" style={{ paddingTop: 44, paddingBottom: 40 }}>
      <div className="glass" style={{ padding: 22, overflow: "hidden", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            inset: -1,
            pointerEvents: "none",
            background:
              "radial-gradient(600px 260px at 20% 20%, rgba(155,123,255,0.30), transparent 60%), radial-gradient(520px 260px at 85% 30%, rgba(51,214,255,0.22), transparent 60%), radial-gradient(700px 320px at 55% 95%, rgba(255,59,212,0.14), transparent 60%)",
            filter: "blur(10px)",
            opacity: 0.95,
          }}
        />

        <div style={{ position: "relative" }}>
          <div className="pill" style={{ width: "fit-content" }}>
            <Icon name="spark" />
            <span>AI-native multi-tenant platform</span>
          </div>

          <h1 style={{ fontSize: 42, margin: "14px 0 6px 0", letterSpacing: "-0.04em" }}>
            AIhub
          </h1>
          <p className="muted" style={{ marginTop: 0, maxWidth: 720, fontSize: 16 }}>
            Un “Operations OS” para empresas: agentes especializados, documentos con RAG, automatizaciones,
            calendario, reportes y realtime. Listo para mostrar en portfolio y evolucionar a producto real.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
            <Link href="/dashboard" className="btn btnPrimary">
              <Icon name="grid" />
              <span style={{ fontSize: 13 }}>Entrar al dashboard</span>
            </Link>
            <Link href="/login" className="btn">
              <span style={{ fontSize: 13 }}>Login</span>
              <Icon name="arrow" />
            </Link>
            <a href="http://localhost:3001/docs" className="btn" target="_blank" rel="noreferrer">
              <span style={{ fontSize: 13 }}>API Docs</span>
              <Icon name="arrow" />
            </a>
          </div>

          <div style={{ height: 18 }} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <div className="card kpi">
              <div className="muted2" style={{ fontSize: 12 }}>
                Latencia percibida
              </div>
              <div className="kpiValue">Instant</div>
              <div className="muted2" style={{ fontSize: 12 }}>
                Realtime + UX con microinteracciones.
              </div>
            </div>
            <div className="card kpi">
              <div className="muted2" style={{ fontSize: 12 }}>
                Arquitectura
              </div>
              <div className="kpiValue">Multi-tenant</div>
              <div className="muted2" style={{ fontSize: 12 }}>
                Base lista para RLS + roles.
              </div>
            </div>
            <div className="card kpi">
              <div className="muted2" style={{ fontSize: 12 }}>
                IA
              </div>
              <div className="kpiValue">Agents+RAG</div>
              <div className="muted2" style={{ fontSize: 12 }}>
                Vendor agnostic (OpenAI compatible).
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

