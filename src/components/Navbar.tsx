"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";
import { CloseIcon, MenuIcon } from "./Icons";
import { ScrollProgress } from "./ScrollProgress";
import { SocialLinks } from "./SocialLinks";
import { ThemeToggle } from "./ThemeToggle";

export const navItems = [
  { label: "About", href: "/" },
  { label: "Projects", href: "/projects/" },
  { label: "CV", href: "/cv/" },
  { label: "Teaching", href: "/teaching/" },
  { label: "Photos", href: "/photos/" },
  { label: "Contact", href: "/contact/" },
];

function isActive(pathname: string, href: string) {
  const path = pathname.replace(/index\.html$/, "").replace(/\/?$/, "/");
  return href === "/" ? path === "/" : path.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const home = isActive(pathname, "/");

  return (
    <header className="sticky top-0 z-50 border-b border-divider bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/85">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-1.5 focus:text-white dark:focus:text-bg"
      >
        Skip to content
      </a>
      <nav aria-label="Main">
        <div className="mx-auto flex h-14 max-w-[1000px] items-center justify-between px-4">
          {home ? (
            <SocialLinks size={22} />
          ) : (
            <Link href="/" className="text-xl font-light text-fg hover:text-accent">
              <span className="font-bold">{profile.firstName}</span> {profile.lastName}
            </Link>
          )}

          <div className="flex items-center gap-1">
            <ul className="hidden items-center sm:flex">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn("px-2 py-2 transition-colors hover:text-accent md:px-3", active ? "font-medium text-accent" : "text-fg")}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ThemeToggle />
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded text-fg sm:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <ul id="mobile-menu" className="border-t border-divider px-4 py-2 sm:hidden">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn("block py-2 text-right", active ? "font-medium text-accent" : "text-fg")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      <ScrollProgress />
    </header>
  );
}
