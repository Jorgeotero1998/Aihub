"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    })();
  }, [router]);

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
      <div className="glass" style={{ padding: 18 }}>
        <div className="muted">Cerrando sesión…</div>
      </div>
    </main>
  );
}

