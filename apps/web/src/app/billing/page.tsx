"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Icon } from "../../components/Icon";

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Para demo/portfolio y pruebas internas.",
    features: ["1 tenant", "RAG demo", "Automations básicas", "Realtime"],
    primary: false,
  },
  {
    name: "Pro",
    price: "$29",
    desc: "Para equipos que quieren escalar operaciones con IA.",
    features: ["RAG + embeddings", "Agentes con herramientas", "Reportes avanzados", "SLA/Alerts"],
    primary: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Seguridad, compliance y despliegue dedicado.",
    features: ["SAML/SSO", "Audit logs", "Isolación avanzada", "Soporte premium"],
    primary: false,
  },
];

export default function BillingPage() {
  const [sub, setSub] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setMsg(null);
    const res = await fetch("/api/billing/me", { cache: "no-store" });
    if (res.ok) setSub(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function checkout(plan: string) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text);
      const data = JSON.parse(text);
      setMsg(data.url ?? "Checkout created");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell
      title="Billing"
      subtitle="Suscripciones y pagos. La integración con Stripe se activa cuando agregás tus keys."
      rightSlot={
        <button className="btn" type="button" onClick={load}>
          <Icon name="grid" />
          <span style={{ fontSize: 13 }}>Refresh</span>
        </button>
      }
    >
      {msg ? (
        <div className="card" style={{ padding: 16, borderRadius: 18 }}>
          <div className="pill">
            <Icon name="spark" />
            <span>{msg}</span>
          </div>
        </div>
      ) : null}

      <div className="card" style={{ padding: 16, borderRadius: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 760, letterSpacing: "-0.02em" }}>Subscription</div>
            <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
              status: {sub?.status ?? "—"} · plan: {sub?.plan ?? "—"} · provider: {sub?.provider ?? "—"}
            </div>
          </div>
          <a className="btn" href="https://stripe.com" target="_blank" rel="noreferrer">
            <Icon name="arrow" />
            <span style={{ fontSize: 13 }}>Stripe</span>
          </a>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {plans.map((p) => (
          <div
            key={p.name}
            className="card"
            style={{
              padding: 16,
              borderRadius: 18,
            }}
          >
            <div className="pill" style={{ width: "fit-content" }}>
              <Icon name="credit" />
              <span>{p.name}</span>
            </div>
            <div style={{ height: 10 }} />
            <div style={{ fontSize: 30, fontWeight: 780, letterSpacing: "-0.04em" }}>{p.price}</div>
            <div className="muted" style={{ marginTop: 6 }}>
              {p.desc}
            </div>
            <div style={{ height: 12 }} />
            <div style={{ display: "grid", gap: 8 }}>
              {p.features.map((f) => (
                <div key={f} className="pill">
                  <Icon name="spark" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 12 }} />
            <button
              className={p.primary ? "btn btnPrimary" : "btn"}
              type="button"
              onClick={() => checkout(p.name.toLowerCase())}
              disabled={busy}
            >
              <Icon name="arrow" />
              <span style={{ fontSize: 13 }}>
                {busy ? "Procesando..." : p.primary ? "Elegir Pro" : "Seleccionar"}
              </span>
            </button>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 16, borderRadius: 18 }}>
        <div style={{ fontWeight: 740, letterSpacing: "-0.02em" }}>Estado</div>
        <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
          Para activarlo: setear `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` y `STRIPE_PRICE_ID` en `apps/api/.env`.
        </div>
      </div>
    </AppShell>
  );
}

