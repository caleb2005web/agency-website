import Link from "next/link";
import { SITE } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-gray-600 sm:flex-row sm:justify-between">
        <div>
          <p className="font-semibold text-gray-900">{SITE.name}</p>
          <p>{SITE.address}</p>
        </div>
        <div>
          <p>{SITE.email}</p>
          <p>{SITE.phone}</p>
        </div>
        <div className="sm:text-right">
          <p>&copy; {new Date().getFullYear()} {SITE.name}</p>
          <Link href="/admin" className="text-gray-500 hover:underline">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
