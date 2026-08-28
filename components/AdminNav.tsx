"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b hairline bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <span className="font-display text-lg font-semibold">GreenNest Admin</span>
        <nav className="flex items-center gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-sm px-3 py-2 text-sm font-medium ${
                pathname === link.href
                  ? "bg-soil-900 text-paper"
                  : "text-soil-900/70 hover:bg-soil-900/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="ml-2 rounded-sm px-3 py-2 text-sm font-medium text-soil-900/50 hover:text-radish"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
