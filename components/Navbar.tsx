"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Search from "./Search";

const navItems = [
  { href: "/", label: "होम" },
  { href: "/#featured-blogs", label: "विशेष" },
  { href: "/#categories", label: "श्रेणियां" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500">
            <span className="text-xs font-bold text-white">BB</span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-neutral-100">
            जैन धर्म ब्लॉग
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-300 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative transition-colors hover:text-white",
                pathname === item.href && "text-white"
              )}
            >
              {item.label}
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-opacity",
                  pathname === item.href && "opacity-100"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Search />
          <a
            href="#blogs"
            className="hidden rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-sm transition hover:bg-neutral-200 sm:inline-flex"
          >
            पढ़ना शुरू करें
          </a>
        </div>
      </div>
    </header>
  );
}


