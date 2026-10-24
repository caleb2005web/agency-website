type Project = { id: number; title: string; category: string; description: string; image_url: string | null; link: string | null };

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <div className="card overflow-hidden !p-0">
      {p.image_url ? (
        <img src={p.image_url} alt={p.title} className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-44 items-center justify-center bg-gray-100 text-sm text-gray-400">No image</div>
      )}
      <div className="p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">{p.category}</span>
        <h3 className="mt-1 font-semibold">{p.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{p.description}</p>
        {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-indigo-600 hover:underline">Visit site</a>}
      </div>
    </div>
  );
}
