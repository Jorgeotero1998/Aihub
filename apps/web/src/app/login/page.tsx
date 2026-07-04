"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "../../components/Icon";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@demo.com");
  const [password, setPassword] = useState("password123");
  const [tenantName, setTenantName] = useState("Demo Company");
  const [tenantSlug, setTenantSlug] = useState("demo-company");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function prettyError(raw: string) {
    const t = raw.trim();
    if (!t) return "Error";
    if (t.startsWith("{") && t.endsWith("}")) {
      try {
        const j = JSON.parse(t) as any;
        return j.error ? `${j.error}${j.detail ? ` (${j.detail})` : ""}` : t;
      } catch {
        return t;
      }
    }
    return t;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(prettyError(txt || "Login failed"));
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function createDemo() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, tenantName, tenantSlug }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(prettyError(txt || "Register failed"));
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
      <div
        className="glass"
        style={{
          padding: 18,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 0.9fr)",
          gap: 14,
        }}
      >
        <div className="card" style={{ padding: 16, borderRadius: 18 }}>
          <div className="pill" style={{ width: "fit-content" }}>
            <Icon name="shield" />
            <span>Auth multi-tenant</span>
          </div>
          <h1 style={{ fontSize: 26, margin: "12px 0 6px 0", letterSpacing: "-0.03em" }}>
            Entrar al workspace
          </h1>
          <p className="muted" style={{ marginTop: 0 }}>
            Podés loguearte, o crear un workspace demo (tenant + owner) para ver todo funcionando.
          </p>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, marginTop: 14 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span className="muted2" style={{ fontSize: 12 }}>
                Email
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "12px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(0,0,0,0.24)",
                  color: "var(--fg)",
                  outline: "none",
                }}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span className="muted2" style={{ fontSize: 12 }}>
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "12px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(0,0,0,0.24)",
                  color: "var(--fg)",
                  outline: "none",
                }}
              />
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              <button className="btn btnPrimary" type="submit" disabled={loading}>
                <Icon name="arrow" />
                <span style={{ fontSize: 13 }}>{loading ? "Entrando..." : "Login"}</span>
              </button>
              <Link className="btn" href="/">
                <span style={{ fontSize: 13 }}>Volver</span>
                <Icon name="arrow" />
              </Link>
            </div>
          </form>

          {error ? (
            <div style={{ marginTop: 12 }} className="pill">
              <span style={{ color: "rgba(255,77,109,0.95)" }}>Error:</span>
              <span>{error}</span>
            </div>
          ) : null}
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 18 }}>
          <div className="pill" style={{ width: "fit-content" }}>
            <Icon name="spark" />
            <span>Demo workspace</span>
          </div>
          <div style={{ height: 10 }} />
          <div style={{ fontWeight: 740, letterSpacing: "-0.02em" }}>Crear tenant + owner</div>
          <div className="muted2" style={{ fontSize: 12, marginTop: 6 }}>
            Ideal para portfolio: crea tu empresa (tenant) y te loguea automáticamente.
          </div>
          <div style={{ height: 12 }} />
          <div style={{ display: "grid", gap: 10 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span className="muted2" style={{ fontSize: 12 }}>
                Tenant name
              </span>
              <input
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                style={{
                  padding: "12px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(0,0,0,0.24)",
                  color: "var(--fg)",
                  outline: "none",
                }}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span className="muted2" style={{ fontSize: 12 }}>
                Tenant slug
              </span>
              <input
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
                style={{
                  padding: "12px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(0,0,0,0.24)",
                  color: "var(--fg)",
                  outline: "none",
                }}
              />
            </label>
            <button className="btn btnPrimary" type="button" onClick={createDemo} disabled={loading}>
              <Icon name="spark" />
              <span style={{ fontSize: 13 }}>{loading ? "Creando..." : "Crear demo"}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

