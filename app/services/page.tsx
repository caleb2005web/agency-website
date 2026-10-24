import Link from "next/link";
import { SERVICES } from "@/lib/config";

export default function Services() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold">Our services</h1>
      <p className="mt-3 max-w-2xl text-gray-600">Everything you need to get your business online and keep it running.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <div key={s.title} className="card">
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{s.text}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {s.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <Link href="/contact" className="btn mt-10">Request a quote</Link>
    </div>
  );
}
