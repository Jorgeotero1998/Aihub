import Link from "next/link";
import { Icon } from "./Icon";
import { SideNav } from "./SideNav";

export function AppShell({
  title,
  subtitle,
  rightSlot,
  children,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="container pageEnter" style={{ paddingTop: 22, paddingBottom: 22 }}>
        <div
          className="glass"
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 16,
            padding: 14,
          }}
        >
          <aside
            className="card"
            style={{
              padding: 14,
              borderRadius: 18,
              position: "sticky",
              top: 18,
              height: "calc(100vh - 80px)",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background:
                    "linear-gradient(180deg, rgba(0,112,243,0.60), rgba(0,112,243,0.18))",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              />
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontWeight: 750, letterSpacing: "-0.02em" }}>AIhub</div>
                <div className="muted2" style={{ fontSize: 12 }}>
                  Multi-tenant Ops OS
                </div>
              </div>
            </div>

            <div style={{ height: 14 }} />
            <div className="pill">
              <Icon name="bell" />
              <span>Realtime habilitado</span>
            </div>

            <div style={{ height: 18 }} />

            <SideNav />

            <div style={{ position: "absolute", inset: "auto 0 0 0", padding: 14 }}>
              <div
                className="card"
                style={{
                  padding: 12,
                  borderRadius: 16,
                  display: "grid",
                  gap: 8,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                }}
              >
                <div style={{ fontWeight: 650, letterSpacing: "-0.01em" }}>Demo Mode</div>
                <div className="muted2" style={{ fontSize: 12 }}>
                  Listo para portfolio. Conectá tus keys cuando quieras.
                </div>
              </div>
            </div>
          </aside>

          <section style={{ minWidth: 0 }}>
            <header
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 14,
                padding: "4px 6px 14px 6px",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 760, letterSpacing: "-0.03em" }}>{title}</div>
                {subtitle ? (
                  <div className="muted" style={{ marginTop: 6, maxWidth: 680 }}>
                    {subtitle}
                  </div>
                ) : null}
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {rightSlot}
                <Link href="/logout" className="btn">
                  <Icon name="logout" />
                  <span style={{ fontSize: 13 }}>Logout</span>
                </Link>
              </div>
            </header>

            <div style={{ display: "grid", gap: 14 }}>{children}</div>
          </section>
        </div>
      </div>
    </div>
  );
}

