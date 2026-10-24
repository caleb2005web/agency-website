import { SITE } from "@/lib/config";

const team = [
  { name: "Amina Wanjiru", role: "Founder & Lead Developer" },
  { name: "Brian Otieno", role: "UI/UX Designer" },
  { name: "Grace Mwangi", role: "Project Manager" },
];
const values = [
  { title: "Clear communication", text: "You always know where your project stands." },
  { title: "Quality code", text: "Simple, tested and easy for others to maintain." },
  { title: "Fair pricing", text: "Honest quotes with no surprise charges." },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold">About {SITE.name}</h1>
      <p className="mt-4 max-w-2xl text-gray-600">
        We're a small team based in {SITE.address}. We started because we saw many good local businesses with outdated or
        missing websites. Today we help them get online with sites that are fast, simple to use and built to last.
      </p>

      <h2 className="mt-12 text-xl font-semibold">What we care about</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="card"><h3 className="font-semibold">{v.title}</h3><p className="mt-2 text-sm text-gray-600">{v.text}</p></div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold">The team</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {team.map((t) => (
          <div key={t.name} className="card">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">{t.name[0]}</div>
            <p className="font-medium">{t.name}</p>
            <p className="text-sm text-gray-600">{t.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
