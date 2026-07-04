"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" as const },
  { href: "/agents", label: "Agentes IA", icon: "spark" as const },
  { href: "/documents", label: "Documentos", icon: "doc" as const },
  { href: "/chat", label: "Chat (RAG)", icon: "chat" as const },
  { href: "/automations", label: "Automatizaciones", icon: "bolt" as const },
  { href: "/calendar", label: "Calendario", icon: "calendar" as const },
  { href: "/reports", label: "Reportes", icon: "report" as const },
  { href: "/billing", label: "Billing", icon: "credit" as const },
  { href: "/admin", label: "Admin", icon: "shield" as const },
];

export function SideNav() {
  const path = usePathname();

  return (
    <nav style={{ display: "grid", gap: 8 }}>
      {nav.map((n) => {
        const active = path === n.href || path?.startsWith(`${n.href}/`);
        return (
          <Link
            key={n.href}
            href={n.href}
            className="btn"
            style={{
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: 14,
              background: active
                ? "linear-gradient(135deg, rgba(124,58,237,0.24), rgba(6,182,212,0.10))"
                : undefined,
              borderColor: active ? "rgba(255,255,255,0.22)" : undefined,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <span style={{ opacity: 0.9 }}>
                <Icon name={n.icon} />
              </span>
              <span style={{ fontSize: 13, letterSpacing: "-0.01em" }}>{n.label}</span>
            </span>
            <span style={{ opacity: active ? 0.9 : 0.55 }}>
              <Icon name="arrow" />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

