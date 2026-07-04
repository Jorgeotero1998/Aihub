import { NextResponse } from "next/server";

export async function POST() {
  const cookieName = process.env.AUTH_COOKIE_NAME ?? "aihub_session";
  const out = NextResponse.json({ ok: true });
  out.cookies.set(cookieName, "", { httpOnly: true, sameSite: "lax", secure: false, path: "/", maxAge: 0 });
  out.cookies.set("aihub_tenant", "", { httpOnly: false, sameSite: "lax", secure: false, path: "/", maxAge: 0 });
  return out;
}

