import Link from "next/link";
import { query } from "@/lib/db";
import { SITE, SERVICES } from "@/lib/config";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  let projects: any[] = [];
  try {
    projects = await query("SELECT * FROM projects WHERE published = true ORDER BY created_at DESC LIMIT 3");
  } catch (e) {
    console.error(e);
  }

  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">{SITE.tagline}</h1>
        <p className="mt-5 max-w-xl text-lg text-gray-600">
          From a simple company website to a full web app, we handle the design, the code and the launch.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/contact" className="btn">Get a free quote</Link>
          <Link href="/portfolio" className="btn-outline">See our work</Link>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold">What we do</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="card"><h3 className="font-semibold">{s.title}</h3><p className="mt-2 text-sm text-gray-600">{s.text}</p></div>
            ))}
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">Recent projects</h2>
            <Link href="/portfolio" className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {projects.map((p) => <ProjectCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      <section className="bg-indigo-600 py-14 text-center text-white">
        <h2 className="text-2xl font-bold">Have a project in mind?</h2>
        <p className="mt-2 text-indigo-100">Tell us about it and we'll get back to you within 1-2 business days.</p>
        <Link href="/contact" className="mt-6 inline-block rounded-md bg-white px-5 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50">Contact us</Link>
      </section>
    </div>
  );
}
