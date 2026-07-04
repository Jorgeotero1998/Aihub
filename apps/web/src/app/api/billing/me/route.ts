import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3001").replace(
    "localhost",
    "127.0.0.1"
  );
  const cookieName = process.env.AUTH_COOKIE_NAME ?? "aihub_session";
  const token = (await cookies()).get(cookieName)?.value;
  const tenant = (await cookies()).get("aihub_tenant")?.value;

  let res: Response;
  try {
    res = await fetch(`${apiBase}/billing/me`, {
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(tenant ? { "x-tenant-id": tenant } : {}),
      },
      cache: "no-store",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return NextResponse.json({ error: "API unreachable", detail: msg }, { status: 502 });
  }

  const text = await res.text();
  if (!res.ok) return new NextResponse(text, { status: res.status });
  return new NextResponse(text, { status: 200, headers: { "content-type": "application/json" } });
}

