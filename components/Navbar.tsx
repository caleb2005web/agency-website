"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/config";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold">{SITE.name}</Link>
        <button className="text-sm md:hidden" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
        <ul className={`${open ? "flex" : "hidden"} absolute left-0 top-14 z-10 w-full flex-col gap-3 border-b bg-white px-4 py-4 text-sm md:static md:flex md:w-auto md:flex-row md:gap-6 md:border-0 md:p-0`}>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}
                className={pathname === l.href ? "font-semibold text-indigo-600" : "text-gray-700 hover:text-indigo-600"}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
