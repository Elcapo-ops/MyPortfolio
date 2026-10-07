"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { SiteSettings, ThemeName } from "@/types";

const themes: { id: ThemeName; label: string; color: string }[] = [
  { id: "blue", label: "Blue", color: "#2196ff" },
  { id: "light", label: "Light", color: "#147dff" },
  { id: "purple", label: "Purple", color: "#a66bff" },
  { id: "green", label: "Green", color: "#20d6a0" },
  { id: "minimal", label: "Minimal", color: "#111316" },
  { id: "sunset", label: "Sunset", color: "#ff734c" }
];

function isThemeName(value: string | null): value is ThemeName {
  return themes.some((theme) => theme.id === value);
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeName>("blue");

  useEffect(() => {
    let mounted = true;
    const saved = localStorage.getItem("portfolio-theme");
    const apply = (selected: ThemeName) => {
      if (!mounted) return;
      setTheme(selected);
      document.documentElement.dataset.theme = selected;
    };

    void api<SiteSettings>("/site-settings/")
      .then((settings) => apply(isThemeName(saved) ? saved : settings.default_theme))
      .catch(() => apply(isThemeName(saved) ? saved : "blue"));

    return () => {
      mounted = false;
    };
  }, []);

  function selectTheme(selected: ThemeName) {
    setTheme(selected);
    document.documentElement.dataset.theme = selected;
    localStorage.setItem("portfolio-theme", selected);
  }

  return (
    <div className="relative z-10 flex shrink-0 items-center gap-2 overflow-visible py-2 pl-4">
      {themes.map((item) => (
        <button
          key={item.id}
          aria-label={`Use ${item.label} theme`}
          title={item.label}
          onClick={() => selectTheme(item.id)}
          className={`relative h-5 w-5 shrink-0 rounded-full border border-white/50 transition-[transform,box-shadow] duration-150 hover:z-10 hover:scale-110 hover:shadow-[0_0_0_3px_var(--border)] focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${theme === item.id ? "ring-2 ring-[var(--foreground)] ring-offset-2 ring-offset-[var(--background)]" : ""}`}
          style={{ background: item.color }}
        />
      ))}
    </div>
  );
}
