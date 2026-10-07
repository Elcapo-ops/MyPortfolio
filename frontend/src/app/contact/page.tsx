import { Mail, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import type { PortfolioPage, Profile } from "@/types";

export const dynamic = "force-dynamic";

export default async function Contact() {
  const [profile, page] = await Promise.all([
    api<Profile>("/profile/"),
    api<PortfolioPage>("/pages/contact/")
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-24">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--accent)]">{page.eyebrow}</p>
        <h1 className="mt-3 text-5xl font-black sm:text-7xl">{page.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{page.description}</p>
      </Reveal>
      <div className="mt-14 grid gap-6 lg:grid-cols-[.65fr_1.35fr]">
        <Reveal>
          <div className="liquid-card rounded-3xl p-7">
            <div className="flex items-start gap-4">
              <Mail className="text-[var(--accent)]" />
              <div><p className="font-bold">Email</p><a className="mt-1 block text-sm text-[var(--muted)]" href={`mailto:${profile.email}`}>{profile.email}</a></div>
            </div>
            <div className="mt-7 flex items-start gap-4">
              <MapPin className="text-[var(--accent)]" />
              <div><p className="font-bold">Location</p><p className="mt-1 text-sm text-[var(--muted)]">{profile.location || "Remote"}</p></div>
            </div>
            {page.section_title && <h2 className="mt-8 font-bold">{page.section_title}</h2>}
            {page.section_description && <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{page.section_description}</p>}
          </div>
        </Reveal>
        <Reveal delay={0.1}><ContactForm /></Reveal>
      </div>
    </div>
  );
}
