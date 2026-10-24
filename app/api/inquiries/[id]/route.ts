import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { is_read } = await req.json().catch(() => ({}));
  await query("UPDATE inquiries SET is_read = $1 WHERE id = $2", [!!is_read, Number(params.id)]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await query("DELETE FROM inquiries WHERE id = $1", [Number(params.id)]);
  return NextResponse.json({ ok: true });
}
