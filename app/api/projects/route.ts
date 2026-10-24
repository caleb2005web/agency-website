import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await query("SELECT * FROM projects ORDER BY created_at DESC");
  return NextResponse.json({ projects: rows });
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!b.title || !b.description) return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
  await query(
    "INSERT INTO projects (title, category, description, image_url, link, published) VALUES ($1,$2,$3,$4,$5,$6)",
    [b.title, b.category || "Website", b.description, b.image_url || null, b.link || null, b.published !== false]);
  return NextResponse.json({ ok: true });
}
