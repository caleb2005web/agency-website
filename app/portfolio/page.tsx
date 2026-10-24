import Link from "next/link";
import { query } from "@/lib/db";
import { CATEGORIES } from "@/lib/config";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = "force-dynamic";

export default async function Portfolio({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category;
  const projects = category
    ? await query("SELECT * FROM projects WHERE published = true AND category = $1 ORDER BY created_at DESC", [category])
    : await query("SELECT * FROM projects WHERE published = true ORDER BY created_at DESC");

  const tab = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm ${active ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-300 hover:border-indigo-600"}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold">Our work</h1>
      <p className="mt-3 text-gray-600">A selection of recent projects.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/portfolio" className={tab(!category)}>All</Link>
        {CATEGORIES.map((c) => (
          <Link key={c} href={`/portfolio?category=${encodeURIComponent(c)}`} className={tab(category === c)}>{c}</Link>
        ))}
      </div>

      {projects.length === 0 ? (
        <p className="mt-10 text-gray-500">No projects in this category yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p.id} p={p as any} />)}
        </div>
      )}
    </div>
  );
}
