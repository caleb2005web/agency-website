import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!b.title || !b.description) return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
  await query(
    "UPDATE projects SET title=$1, category=$2, description=$3, image_url=$4, link=$5, published=$6 WHERE id=$7",
    [b.title, b.category || "Website", b.description, b.image_url || null, b.link || null, b.published !== false, Number(params.id)]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await query("DELETE FROM projects WHERE id = $1", [Number(params.id)]);
  return NextResponse.json({ ok: true });
}
