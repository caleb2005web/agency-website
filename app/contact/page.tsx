"use client";
import { useState } from "react";
import { SITE } from "@/lib/config";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setStatus("idle"); return; }
    setStatus("sent");
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold">Contact us</h1>
        <p className="mt-3 text-gray-600">Tell us about your project and we'll reply within 1-2 business days.</p>
        <div className="mt-6 space-y-1 text-sm text-gray-700">
          <p>{SITE.email}</p>
          <p>{SITE.phone}</p>
          <p>{SITE.address}</p>
        </div>
      </div>

      {status === "sent" ? (
        <div className="card self-start">
          <h2 className="text-lg font-semibold">Message sent</h2>
          <p className="mt-2 text-sm text-gray-600">Thanks {form.name}! We've sent a confirmation to {form.email}.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="card space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <input className="input" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <textarea className="input" rows={5} placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          {/* honeypot - hidden from real users */}
          <input className="hidden" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          <button className="btn w-full" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Send message"}</button>
        </form>
      )}
    </div>
  );
}
