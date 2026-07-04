"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Icon } from "../../components/Icon";

type Tenant = { id: string; name: string; slug: string } | null;
type Membership = {
  id: string;
  role: string;
  user?: { id: string; email: string; fullName?: string; isActive: boolean } | null;
};

export default function AdminPage() {
  const [tenant, setTenant] = useState<Tenant>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const [tRes, mRes] = await Promise.all([fetch("/api/admin/tenant"), fetch("/api/admin/memberships")]);
      if (!tRes.ok) throw new Error(await tRes.text());
      if (!mRes.ok) throw new Error(await mRes.text());
      setTenant(await tRes.json());
      setMemberships(await mRes.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AppShell
      title="Admin"
      subtitle="Panel administrativo multi-tenant (usuarios, roles, tenants, billing)."
      rightSlot={
        <button className="btn" type="button" onClick={load}>
          <Icon name="grid" />
          <span style={{ fontSize: 13 }}>Refresh</span>
        </button>
      }
    >
      {error ? (
        <div className="card" style={{ padding: 16, borderRadius: 18 }}>
          <div className="pill">
            <span style={{ color: "rgba(251,113,133,0.95)" }}>Error</span>
            <span className="muted">{error}</span>
          </div>
        </div>
      ) : null}

      <div className="card" style={{ padding: 16, borderRadius: 18 }}>
        <div className="pill" style={{ width: "fit-content" }}>
          <Icon name="shield" />
          <span>Tenant</span>
        </div>
        <div style={{ height: 10 }} />
        <div style={{ fontWeight: 780, letterSpacing: "-0.03em", fontSize: 18 }}>
          {tenant?.name ?? "—"}
        </div>
        <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
          slug: {tenant?.slug ?? "—"} · id: {tenant?.id ?? "—"}
        </div>
      </div>

      <div className="card" style={{ padding: 16, borderRadius: 18 }}>
        <div style={{ fontWeight: 760, letterSpacing: "-0.02em" }}>Memberships</div>
        <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
          Usuarios y roles del tenant actual.
        </div>
        <div style={{ height: 12 }} />
        <div style={{ display: "grid", gap: 10 }}>
          {memberships.map((m) => (
            <div
              key={m.id}
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
                <div style={{ fontWeight: 650 }}>
                  {m.user?.email ?? "unknown"}{" "}
                  <span className="muted2" style={{ fontSize: 12 }}>
                    ({m.role})
                  </span>
                </div>
                <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
                  {m.user?.fullName ?? "—"} · active: {String(m.user?.isActive ?? false)}
                </div>
              </div>
              <span className="pill">
                <Icon name="spark" />
                <span>RBAC</span>
              </span>
            </div>
          ))}
          {memberships.length === 0 ? <div className="muted">Sin memberships.</div> : null}
        </div>
      </div>
    </AppShell>
  );
}

