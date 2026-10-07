"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { PortfolioPage } from "@/types";
import { ThemeSwitcher } from "./ThemeSwitcher";

const links = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Blog", id: "blog" },
  { label: "Contact", id: "contact" }
] as const;

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [customPages, setCustomPages] = useState<PortfolioPage[]>([]);

  useEffect(() => {
    let active = true;
    void api<PortfolioPage[]>("/pages/")
      .then((pages) => {
        if (active) {
          setCustomPages(pages.filter((page) => page.show_in_navigation && !links.some((link) => link.id === page.slug)));
        }
      })
      .catch((error: unknown) => console.error("Could not load portfolio page navigation.", error));
    return () => {
      active = false;
    };
  }, []);

  const allLinks = useMemo(() => [
    ...links.slice(0, -1).map((link) => ({ label: link.label, id: link.id })),
    ...customPages.map((page) => ({ label: page.title, id: page.slug })),
    { label: "Contact", id: "contact" }
  ], [customPages]);

  useEffect(() => {
    if (path !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = allLinks.map((link) => link.id);
    const updateActiveSection = () => {
      const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      const marker = headerBottom + window.innerHeight * 0.3;
      let current = sectionIds[0] ?? "home";

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= marker) current = id;
      }

      const atPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atPageBottom) current = sectionIds.at(-1) ?? current;
      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [allLinks, path]);

  function sectionLinkClass(id: string) {
    return `relative whitespace-nowrap px-1 py-2 text-sm transition-colors after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[var(--accent)] after:transition-transform after:duration-200 hover:text-[var(--foreground)] hover:after:scale-x-100 focus-visible:outline-none focus-visible:after:scale-x-100 ${
      activeSection === id ? "text-[var(--accent)] after:scale-x-100" : "text-[var(--muted)]"
    }`;
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="liquid-card mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3">
        <Link href="/#home" className="text-lg font-black tracking-tight" onClick={() => setOpen(false)}>
          AF<span className="text-[var(--accent)]">.</span>
        </Link>
        <div className="hidden min-w-0 max-w-[calc(100%-3rem)] items-center md:flex">
          <div className="flex min-w-0 items-center gap-4 overflow-x-auto px-1">
            {allLinks.map((link) => (
              <Link
                key={link.id}
                href={`/#${link.id}`}
                aria-current={activeSection === link.id ? "location" : undefined}
                className={sectionLinkClass(link.id)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <ThemeSwitcher />
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="liquid-card mx-auto mt-2 max-w-6xl rounded-2xl p-4 md:hidden">
          <div className="grid grid-cols-2 gap-1">
            {allLinks.map((link) => (
              <Link
                onClick={() => setOpen(false)}
                key={link.id}
                href={`/#${link.id}`}
                aria-current={activeSection === link.id ? "location" : undefined}
                className={`relative rounded-xl px-3 py-3 transition-colors hover:bg-white/5 ${activeSection === link.id ? "bg-white/5 text-[var(--accent)] underline decoration-2 underline-offset-4" : "text-[var(--muted)]"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 px-3">
            <ThemeSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
