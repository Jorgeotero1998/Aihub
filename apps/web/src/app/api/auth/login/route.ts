import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3001").replace(
    "localhost",
    "127.0.0.1"
  );
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "API unreachable";
    return NextResponse.json({ error: "API unreachable", detail: msg }, { status: 502 });
  }

  const text = await res.text();
  if (!res.ok) return new NextResponse(text, { status: res.status });

  let data: { accessToken: string; tenantId: string };
  try {
    data = JSON.parse(text) as { accessToken: string; tenantId: string };
  } catch {
    return NextResponse.json(
      { error: "Invalid API response", detail: text.slice(0, 300) },
      { status: 502 }
    );
  }
  const cookieName = process.env.AUTH_COOKIE_NAME ?? "aihub_session";

  const out = NextResponse.json({ ok: true });
  out.cookies.set(cookieName, data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  out.cookies.set("aihub_tenant", data.tenantId, {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  return out;
}

