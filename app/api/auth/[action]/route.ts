import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { setSession, clearSession, getSession } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { action: string } }) {
  if (params.action !== "me") return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user: await getSession() });
}

export async function POST(req: Request, { params }: { params: { action: string } }) {
  if (params.action === "logout") {
    clearSession();
    return NextResponse.json({ ok: true });
  }
  if (params.action !== "login") return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const rows = await query("SELECT * FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(String(body.password || ""), user.password_hash))) {
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }
  await setSession({ id: user.id, email: user.email });
  return NextResponse.json({ ok: true });
}
