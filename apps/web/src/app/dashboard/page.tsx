import { cookies } from "next/headers";
import Link from "next/link";
import { AppShell } from "../../components/AppShell";
import { Icon } from "../../components/Icon";
import DashboardClient from "./DashboardClient";

async function getMe() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
  const cookieName = process.env.AUTH_COOKIE_NAME ?? "aihub_session";
  const token = (await cookies()).get(cookieName)?.value;
  const tenant = (await cookies()).get("aihub_tenant")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${apiBase}/auth/me`, {
      headers: {
        authorization: `Bearer ${token}`,
        ...(tenant ? { "x-tenant-id": tenant } : {}),
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as any;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const me = await getMe();

  if (!me) {
    return (
      <main className="container" style={{ paddingTop: 30, paddingBottom: 30 }}>
        <div className="glass" style={{ padding: 18 }}>
          <h1 style={{ fontSize: 22, margin: 0 }}>Dashboard</h1>
          <p className="muted" style={{ marginTop: 10 }}>
            Necesitás iniciar sesión para ver tu workspace.
          </p>
          <Link href="/login" className="btn btnPrimary">
            <Icon name="arrow" />
            <span style={{ fontSize: 13 }}>Ir a login</span>
          </Link>
        </div>
      </main>
    );
  }

  const kpis = [
    { label: "Agentes activos", value: "3", hint: "Soporte, Ventas, RR.HH." },
    { label: "Docs indexados", value: "12", hint: "RAG listo para consultas" },
    { label: "Automations", value: "5", hint: "Jobs + triggers" },
    { label: "Realtime", value: "ON", hint: "Notifs en vivo" },
  ];

  return (
    <AppShell
      title="Dashboard"
      subtitle="Tu control center multi-tenant. Todo lo que pasa en tu empresa, en una sola vista."
      rightSlot={<span className="pill">Tenant: {me.tenantId}</span>}
    >
      <DashboardClient tenantId={me.tenantId} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {kpis.map((k) => (
          <div key={k.label} className="card kpi">
            <div className="muted2" style={{ fontSize: 12 }}>
              {k.label}
            </div>
            <div className="kpiValue">{k.value}</div>
            <div className="muted2" style={{ fontSize: 12 }}>
              {k.hint}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          gap: 12,
        }}
      >
        <div className="card" style={{ padding: 16, borderRadius: 18, minHeight: 260 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 720, letterSpacing: "-0.02em" }}>Pulse</div>
              <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
                Actividad en vivo (stream) + predicciones.
              </div>
            </div>
            <div className="pill">
              <Icon name="bell" />
              <span>Live</span>
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div
            style={{
              height: 180,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.10)",
              background:
                "radial-gradient(500px 220px at 20% 20%, rgba(155,123,255,0.25), transparent 55%), radial-gradient(520px 240px at 85% 50%, rgba(51,214,255,0.18), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
                opacity: 0.28,
                maskImage: "radial-gradient(circle at 30% 40%, black, transparent 70%)",
              }}
            />
            <div style={{ position: "absolute", left: 16, bottom: 14, right: 16 }}>
              <div className="muted" style={{ fontSize: 13 }}>
                Próximo: “Resumir tickets críticos”, “Forecast ventas”, “Screening RR.HH.”
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 18, minHeight: 260 }}>
          <div style={{ fontWeight: 720, letterSpacing: "-0.02em" }}>Quick Actions</div>
          <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
            Accesos directos a módulos clave.
          </div>
          <div style={{ height: 12 }} />
          <div style={{ display: "grid", gap: 10 }}>
            <Link className="btn btnPrimary" href="/chat">
              <Icon name="chat" />
              <span style={{ fontSize: 13 }}>Preguntar al knowledge base</span>
            </Link>
            <Link className="btn" href="/agents">
              <Icon name="spark" />
              <span style={{ fontSize: 13 }}>Abrir agentes IA</span>
            </Link>
            <Link className="btn" href="/automations">
              <Icon name="bolt" />
              <span style={{ fontSize: 13 }}>Crear automation</span>
            </Link>
            <Link className="btn" href="/reports">
              <Icon name="report" />
              <span style={{ fontSize: 13 }}>Ver reportes</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 16, borderRadius: 18 }}>
        <div style={{ fontWeight: 720, letterSpacing: "-0.02em" }}>Session snapshot</div>
        <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
          Esto es útil para demo/portfolio mientras conectamos módulos a data real.
        </div>
        <div style={{ height: 10 }} />
        <pre
          style={{
            margin: 0,
            padding: 12,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(0,0,0,0.25)",
            overflow: "auto",
          }}
        >
          {JSON.stringify(me, null, 2)}
        </pre>
      </div>
    </AppShell>
  );
}

