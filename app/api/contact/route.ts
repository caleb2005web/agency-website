import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendInquiryEmails } from "@/lib/mail";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  // Hidden "website" field: real users leave it empty, bots fill it in
  if (b.website) return NextResponse.json({ ok: true });

  const name = String(b.name || "").trim().slice(0, 100);
  const email = String(b.email || "").trim().slice(0, 200);
  const subject = String(b.subject || "").trim().slice(0, 150);
  const message = String(b.message || "").trim().slice(0, 3000);

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
    return NextResponse.json({ error: "Please enter your name, a valid email and a message (10+ characters)." }, { status: 400 });
  }
  await query("INSERT INTO inquiries (name, email, subject, message) VALUES ($1,$2,$3,$4)", [name, email, subject, message]);
  await sendInquiryEmails({ name, email, subject, message });
  return NextResponse.json({ ok: true });
}
