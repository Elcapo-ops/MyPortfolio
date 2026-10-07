"use client";

import { useState } from "react";

export function ProjectDetails({ description }: { description: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-5 border-t border-[var(--border)] pt-4">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="cursor-pointer text-sm font-semibold text-[var(--accent)]"
      >
        {isOpen ? "Hide project details" : "Read project details"}
      </button>
      {isOpen && <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{description}</p>}
    </div>
  );
}
