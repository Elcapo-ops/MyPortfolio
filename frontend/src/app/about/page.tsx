import { api } from "@/lib/api";
import { Reveal } from "@/components/Reveal";
import type { Experience, PortfolioPage, Profile, Skill } from "@/types";

export const dynamic = "force-dynamic";

export default async function About() {
  const [profile, skills, experience, page] = await Promise.all([
    api<Profile>("/profile/"),
    api<Skill[]>("/skills/"),
    api<Experience[]>("/experience/"),
    api<PortfolioPage>("/pages/about/")
  ]);
  const avatarUrl = profile.avatar_url || "/images/profile.jpg";

  return (
    <div className="mx-auto max-w-6xl px-4 py-24">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--accent)]">{page.eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-5xl font-black sm:text-7xl">{page.title}</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--muted)]">{page.description || profile.bio}</p>
      </Reveal>
      <div className="mt-20 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <Reveal>
          <div className="liquid-card rounded-3xl p-7">
            <img src={avatarUrl} alt={profile.name} className="mb-6 h-28 w-28 rounded-2xl object-cover" />
            <p className="text-sm text-[var(--muted)]">Profile</p>
            <h2 className="mt-2 text-2xl font-bold">{profile.name}</h2>
            <p className="mt-2 text-[var(--accent)]">{profile.headline}</p>
            <div className="mt-8 space-y-3 text-sm text-[var(--muted)]"><p>{profile.location}</p><p>{profile.email}</p></div>
          </div>
        </Reveal>
        <div>
          <Reveal><h2 className="text-2xl font-bold">{page.section_title}</h2></Reveal>
          {page.section_description && <p className="mt-2 text-sm text-[var(--muted)]">{page.section_description}</p>}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {skills.map((skill, index) => (
              <Reveal key={skill.id} delay={index * 0.025}>
                <div className="liquid-card rounded-2xl p-5">
                  <p className="font-bold">{skill.name}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{skill.category} · {skill.level}%</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-24">
        <Reveal><h2 className="text-3xl font-black">{page.secondary_title}</h2></Reveal>
        {page.secondary_description && <p className="mt-2 text-[var(--muted)]">{page.secondary_description}</p>}
        <div className="mt-6 space-y-4">
          {experience.length ? experience.map((item) => (
            <Reveal key={item.id}>
              <article className="liquid-card rounded-3xl p-7">
                <div className="flex flex-wrap justify-between gap-3">
                  <h3 className="text-xl font-bold">{item.role}</h3>
                  <span className="text-sm text-[var(--muted)]">{item.company}</span>
                </div>
                <p className="mt-4 leading-7 text-[var(--muted)]">{item.description}</p>
              </article>
            </Reveal>
          )) : <div className="liquid-card rounded-3xl p-7 text-[var(--muted)]">Experience entries can be managed from the portfolio dashboard.</div>}
        </div>
      </div>
    </div>
  );
}
