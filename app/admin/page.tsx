"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/config";

type Project = { id: number; title: string; category: string; description: string; image_url: string | null; link: string | null; published: boolean };
type Inquiry = { id: number; name: string; email: string; subject: string | null; message: string; is_read: boolean; created_at: string };
const empty = { title: "", category: CATEGORIES[0], description: "", image_url: "", link: "", published: true };

export default function Admin() {
  const router = useRouter();
  const [tab, setTab] = useState<"projects" | "inquiries">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  async function load() {
    const [p, i] = await Promise.all([fetch("/api/projects"), fetch("/api/inquiries")]);
    if (p.status === 401 || i.status === 401) return router.push("/admin/login");
    setProjects((await p.json()).projects);
    setInquiries((await i.json()).inquiries);
    setReady(true);
  }
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(editId ? `/api/projects/${editId}` : "/api/projects", {
      method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) return setError((await res.json()).error);
    setForm(empty); setEditId(null); load();
  }

  function edit(p: Project) {
    setEditId(p.id);
    setForm({ ...p, image_url: p.image_url || "", link: p.link || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeProject(id: number) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleRead(i: Inquiry) {
    await fetch(`/api/inquiries/${i.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_read: !i.is_read }) });
    load();
  }

  async function removeInquiry(id: number) {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    load();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (!ready) return <p className="p-8 text-gray-500">Loading...</p>;
  const unread = inquiries.filter((i) => !i.is_read).length;
  const tabCls = (t: string) => `border-b-2 px-1 pb-2 text-sm ${tab === t ? "border-indigo-600 font-semibold text-indigo-600" : "border-transparent text-gray-600"}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <button onClick={logout} className="text-sm text-gray-500 hover:underline">Log out</button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="card !p-4"><p className="text-sm text-gray-500">Projects</p><p className="text-2xl font-semibold">{projects.length}</p></div>
        <div className="card !p-4"><p className="text-sm text-gray-500">Inquiries</p><p className="text-2xl font-semibold">{inquiries.length}</p></div>
        <div className="card !p-4"><p className="text-sm text-gray-500">Unread</p><p className="text-2xl font-semibold">{unread}</p></div>
      </div>

      <div className="mt-8 flex gap-6 border-b">
        <button className={tabCls("projects")} onClick={() => setTab("projects")}>Projects</button>
        <button className={tabCls("inquiries")} onClick={() => setTab("inquiries")}>Inquiries {unread > 0 && `(${unread})`}</button>
      </div>

      {tab === "projects" && (
        <div className="mt-6 space-y-6">
          <form onSubmit={save} className="card space-y-3">
            <h2 className="font-semibold">{editId ? "Edit project" : "Add project"}</h2>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input className="input" placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              <input className="input" placeholder="Project link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
            </div>
            <textarea className="input" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published (visible on the website)</label>
            <div className="flex gap-2">
              <button className="btn">{editId ? "Save changes" : "Add project"}</button>
              {editId && <button type="button" className="btn-outline" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
            </div>
          </form>

          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="card flex items-center justify-between !p-4">
                <div>
                  <p className="font-medium">{p.title} {!p.published && <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs">Hidden</span>}</p>
                  <p className="text-sm text-gray-500">{p.category}</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <button onClick={() => edit(p)} className="text-indigo-600 hover:underline">Edit</button>
                  <button onClick={() => removeProject(p.id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-gray-500">No projects yet.</p>}
          </div>
        </div>
      )}

      {tab === "inquiries" && (
        <div className="mt-6 space-y-3">
          {inquiries.map((i) => (
            <div key={i.id} className="card !p-4">
              <div className="flex cursor-pointer items-center justify-between" onClick={() => setOpen(open === i.id ? null : i.id)}>
                <div>
                  <p className={i.is_read ? "text-gray-600" : "font-semibold"}>{i.name} <span className="text-sm font-normal text-gray-500">- {i.subject || "No subject"}</span></p>
                  <p className="text-xs text-gray-500">{i.email} | {new Date(i.created_at).toLocaleString()}</p>
                </div>
                {!i.is_read && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
              </div>
              {open === i.id && (
                <div className="mt-3 border-t pt-3">
                  <p className="whitespace-pre-wrap text-sm">{i.message}</p>
                  <div className="mt-3 flex gap-4 text-sm">
                    <a href={`mailto:${i.email}?subject=Re: ${i.subject || ""}`} className="text-indigo-600 hover:underline">Reply</a>
                    <button onClick={() => toggleRead(i)} className="text-gray-600 hover:underline">Mark as {i.is_read ? "unread" : "read"}</button>
                    <button onClick={() => removeInquiry(i.id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {inquiries.length === 0 && <p className="text-gray-500">No inquiries yet.</p>}
        </div>
      )}
    </div>
  );
}
