import { AppShell } from "../../components/AppShell";
import { Icon } from "../../components/Icon";

async function getOverview() {
  const res = await fetch("/api/reports/overview", { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as any;
}

function SparkArea({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  const step = 108 / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => {
    const x = 6 + i * step;
    const y = 50 - (v / max) * 42;
    return { x, y };
  });
  const line = `M ${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")}`;
  const area = `${line} L ${pts[pts.length - 1]!.x.toFixed(1)} 50 L 6 50 Z`;
  return (
    <svg width="120" height="56" viewBox="0 0 120 56">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(155,123,255,0.95)" />
          <stop offset="1" stopColor="rgba(51,214,255,0.85)" />
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(51,214,255,0.30)" />
          <stop offset="1" stopColor="rgba(51,214,255,0.00)" />
        </linearGradient>
      </defs>
      <path d="M6 50H114" stroke="rgba(255,255,255,0.14)" />
      <path d={area} fill="url(#g2)" />
      <path d={line} stroke="url(#g1)" strokeWidth="2.4" fill="none" />
      <circle cx={pts[pts.length - 1]!.x} cy={pts[pts.length - 1]!.y} r="3.4" fill="rgba(255,255,255,0.85)" />
    </svg>
  );
}

export default async function ReportsPage() {
  const o = await getOverview();
  const seed = Number(o?.tasks ?? 1) + Number(o?.documents ?? 1) * 3 + Number(o?.calendarEvents ?? 1) * 5;
  const series = Array.from({ length: 12 }, (_, i) => {
    const n = Math.sin((i + seed) * 0.9) * 0.45 + Math.cos((i + seed) * 0.33) * 0.25;
    return Math.max(1, Math.round((seed % 9) + 6 + n * 7));
  });

  return (
    <AppShell
      title="Reportes"
      subtitle="Métricas accionables por tenant: operaciones, conocimiento, automatización y realtime."
      rightSlot={
        <a className="btn" href="http://localhost:3001/docs" target="_blank" rel="noreferrer">
          <Icon name="arrow" />
          <span style={{ fontSize: 13 }}>API</span>
        </a>
      }
    >
      {!o ? (
        <div className="card" style={{ padding: 16, borderRadius: 18 }}>
          <div className="muted">No hay sesión o el backend no responde. Iniciá sesión.</div>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            {[
              { label: "Tasks", value: o.tasks, icon: "bolt" as const },
              { label: "Docs", value: o.documents, icon: "doc" as const },
              { label: "Eventos", value: o.calendarEvents, icon: "calendar" as const },
              { label: "No leídas", value: o.unreadNotifications, icon: "bell" as const },
            ].map((k) => (
              <div key={k.label} className="card kpi">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="muted2" style={{ fontSize: 12 }}>
                    {k.label}
                  </span>
                  <span style={{ opacity: 0.8 }}>
                    <Icon name={k.icon} />
                  </span>
                </div>
                <div className="kpiValue">{k.value}</div>
                <div className="muted2" style={{ fontSize: 12 }}>
                  <SparkArea values={series.map((v) => Math.max(1, v + (Number(k.value) || 1) - 2))} />
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
            <div
              className="card"
              style={{
                padding: 16,
                borderRadius: 18,
                background:
                  "radial-gradient(800px 360px at 20% 20%, rgba(155,123,255,0.22), transparent 60%), radial-gradient(800px 360px at 85% 55%, rgba(51,214,255,0.16), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 760, letterSpacing: "-0.02em" }}>Ops Velocity</div>
                  <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
                    Señal compuesta (demo) basada en tasks/docs/eventos. En producción, esto se alimenta de actividad real.
                  </div>
                </div>
                <span className="pill">
                  <Icon name="spark" />
                  <span>mode: {o.mode ?? "db"}</span>
                </span>
              </div>
              <div style={{ height: 12 }} />
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      height: 220,
                      borderRadius: 18,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(0,0,0,0.20)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <svg width="100%" height="100%" viewBox="0 0 900 240" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0" stopColor="rgba(255,59,212,0.9)" />
                          <stop offset="0.5" stopColor="rgba(155,123,255,0.95)" />
                          <stop offset="1" stopColor="rgba(51,214,255,0.9)" />
                        </linearGradient>
                        <linearGradient id="fillG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stopColor="rgba(155,123,255,0.25)" />
                          <stop offset="1" stopColor="rgba(51,214,255,0.00)" />
                        </linearGradient>
                      </defs>
                      {Array.from({ length: 10 }, (_, i) => (
                        <path
                          key={i}
                          d={`M 0 ${20 + i * 22} L 900 ${20 + i * 22}`}
                          stroke="rgba(255,255,255,0.06)"
                        />
                      ))}
                      {(() => {
                        const v = series;
                        const max = Math.max(1, ...v);
                        const step = 860 / Math.max(1, v.length - 1);
                        const pts = v.map((n, i) => {
                          const x = 20 + i * step;
                          const y = 210 - (n / max) * 170;
                          return { x, y };
                        });
                        const line = `M ${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")}`;
                        const area = `${line} L ${pts[pts.length - 1]!.x.toFixed(1)} 220 L 20 220 Z`;
                        return (
                          <>
                            <path d={area} fill="url(#fillG)" />
                            <path d={line} stroke="url(#lineG)" strokeWidth="3.5" fill="none" />
                            <circle
                              cx={pts[pts.length - 1]!.x}
                              cy={pts[pts.length - 1]!.y}
                              r="6"
                              fill="rgba(255,255,255,0.9)"
                            />
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                </div>
                <div style={{ width: 280 }}>
                  <div className="card" style={{ padding: 14, borderRadius: 16, background: "rgba(0,0,0,0.20)" }}>
                    <div className="muted2" style={{ fontSize: 12 }}>
                      Insight
                    </div>
                    <div style={{ fontWeight: 720, marginTop: 6, letterSpacing: "-0.02em" }}>
                      “Automations-first”
                    </div>
                    <div className="muted" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.45 }}>
                      La plataforma está lista para generar resúmenes (ops digest), detectar anomalías y disparar automatizaciones
                      según picos de actividad.
                    </div>
                    <div style={{ height: 12 }} />
                    <div className="pill">
                      <Icon name="spark" />
                      <span>Generated: {o.generatedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 16, borderRadius: 18, background: "rgba(0,0,0,0.18)" }}>
              <div style={{ fontWeight: 760, letterSpacing: "-0.02em" }}>Distribución</div>
              <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
                Mix operativo (demo).
              </div>
              <div style={{ height: 12 }} />
              {(() => {
                const a = Number(o.tasks ?? 0) + 2;
                const b = Number(o.documents ?? 0) + 1;
                const c = Number(o.calendarEvents ?? 0) + 1;
                const sum = Math.max(1, a + b + c);
                const arc = (start: number, frac: number) => {
                  const r = 72;
                  const cx = 92;
                  const cy = 92;
                  const end = start + frac * Math.PI * 2;
                  const x1 = cx + r * Math.cos(start);
                  const y1 = cy + r * Math.sin(start);
                  const x2 = cx + r * Math.cos(end);
                  const y2 = cy + r * Math.sin(end);
                  const large = frac > 0.5 ? 1 : 0;
                  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
                };
                const fa = a / sum;
                const fb = b / sum;
                const fc = c / sum;
                const s0 = -Math.PI / 2;
                const s1 = s0 + fa * Math.PI * 2;
                const s2 = s1 + fb * Math.PI * 2;
                return (
                  <div style={{ display: "grid", placeItems: "center" }}>
                    <svg width="184" height="184" viewBox="0 0 184 184">
                      <path d={arc(s0, fa)} fill="rgba(155,123,255,0.75)" />
                      <path d={arc(s1, fb)} fill="rgba(51,214,255,0.70)" />
                      <path d={arc(s2, fc)} fill="rgba(255,59,212,0.55)" />
                      <circle cx="92" cy="92" r="52" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.10)" />
                      <text x="92" y="90" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="18" fontWeight="760">
                        {sum}
                      </text>
                      <text x="92" y="110" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="12">
                        signals
                      </text>
                    </svg>
                    <div style={{ display: "grid", gap: 8, width: "100%" }}>
                      <div className="pill">
                        <span style={{ width: 10, height: 10, borderRadius: 99, background: "rgba(155,123,255,0.9)" }} />
                        <span>Tasks</span>
                        <span className="muted2">({Math.round(fa * 100)}%)</span>
                      </div>
                      <div className="pill">
                        <span style={{ width: 10, height: 10, borderRadius: 99, background: "rgba(51,214,255,0.9)" }} />
                        <span>Docs</span>
                        <span className="muted2">({Math.round(fb * 100)}%)</span>
                      </div>
                      <div className="pill">
                        <span style={{ width: 10, height: 10, borderRadius: 99, background: "rgba(255,59,212,0.85)" }} />
                        <span>Eventos</span>
                        <span className="muted2">({Math.round(fc * 100)}%)</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

