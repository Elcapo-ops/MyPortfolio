import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { ContactForm } from "@/components/ContactForm";
import { ProjectDetails } from "@/components/ProjectDetails";
import { Reveal } from "@/components/Reveal";
import type { BlogPost, Experience, PortfolioPage, Profile, Project, Skill } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, projects, skills, experience, posts, pages, homePage, aboutPage, projectsPage, blogPage, contactPage] = await Promise.all([
    api<Profile>("/profile/"),
    api<Project[]>("/projects/"),
    api<Skill[]>("/skills/"),
    api<Experience[]>("/experience/"),
    api<BlogPost[]>("/blog/"),
    api<PortfolioPage[]>("/pages/"),
    api<PortfolioPage>("/pages/home/"),
    api<PortfolioPage>("/pages/about/"),
    api<PortfolioPage>("/pages/projects/"),
    api<PortfolioPage>("/pages/blog/"),
    api<PortfolioPage>("/pages/contact/")
  ]);
  const builtInSlugs = ["home", "about", "projects", "blog", "contact"];
  const customPages = pages.filter((page) => !builtInSlugs.includes(page.slug));
  const avatarUrl = profile.avatar_url || "/images/profile.jpg";

  return (
    <div>
      <section id="home" className="mx-auto flex min-h-[82vh] max-w-6xl scroll-mt-28 items-center px-4 py-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <Reveal>
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 text-xs text-[var(--muted)]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
                {homePage.eyebrow}
              </div>
              <h1 className="max-w-4xl text-5xl font-black tracking-[-.05em] sm:text-7xl">
                <span className="text-gradient">{homePage.title}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{homePage.description || profile.bio}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#projects" className="accent-button rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white transition hover:scale-105">
                  View projects <ArrowDownRight className="ml-1 inline" size={16} />
                </a>
                <a href="#contact" className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-bold transition hover:bg-white/5">
                  Let's talk
                </a>
              </div>
              <div className="mt-8 flex gap-3 text-[var(--muted)]">
                {profile.github_url && <a href={profile.github_url} aria-label="GitHub"><Github /></a>}
                {profile.linkedin_url && <a href={profile.linkedin_url} aria-label="LinkedIn"><Linkedin /></a>}
                <a href={`mailto:${profile.email}`} aria-label="Email"><Mail /></a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-8 rounded-[40%] bg-[var(--accent)] opacity-20 blur-3xl" />
              <div className="liquid-card glow relative aspect-[4/5] overflow-hidden rounded-[40px] p-3">
                <div className="relative flex h-full items-end overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_50%_20%,var(--accent),transparent_35%),linear-gradient(145deg,rgba(255,255,255,.08),transparent)]">
                  <img src={avatarUrl} alt={profile.name} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="relative z-10 p-7">
                    <p className="text-sm text-white/60">{profile.headline}</p>
                    <p className="profile-name mt-2 text-3xl font-black">{profile.name}</p>
                    {profile.location && <p className="mt-2 flex items-center gap-2 text-sm text-white/65"><MapPin size={15} />{profile.location}</p>}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-24">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--accent)]">{aboutPage.eyebrow}</p>
          <h2 className="mt-3 max-w-4xl text-4xl font-black sm:text-6xl">{aboutPage.title}</h2>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--muted)]">{aboutPage.description || profile.bio}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal>
            <div className="liquid-card rounded-3xl p-7">
              <img src={avatarUrl} alt={profile.name} className="mb-6 h-28 w-28 rounded-2xl object-cover" />
              <p className="text-sm text-[var(--muted)]">Profile</p>
              <h3 className="mt-2 text-2xl font-bold">{profile.name}</h3>
              <p className="mt-2 text-[var(--accent)]">{profile.headline}</p>
              <div className="mt-8 space-y-3 text-sm text-[var(--muted)]">
                {profile.location && <p>{profile.location}</p>}
                <p>{profile.email}</p>
                {profile.cv_url && <a href={profile.cv_url} className="inline-flex text-[var(--accent)]" target="_blank" rel="noreferrer">Download CV <ArrowUpRight className="ml-1" size={15} /></a>}
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal><h3 className="text-2xl font-bold">{aboutPage.section_title}</h3></Reveal>
            {aboutPage.section_description && <p className="mt-2 text-sm text-[var(--muted)]">{aboutPage.section_description}</p>}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {skills.map((skill, index) => (
                <Reveal key={skill.id} delay={index * 0.025}>
                  <div className="liquid-card rounded-2xl p-5">
                    <div className="mb-5 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${skill.level}%` }} /></div>
                    <p className="font-bold">{skill.name}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{skill.category} · {skill.level}%</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-20">
          <Reveal>
            <h3 className="text-3xl font-black">{aboutPage.secondary_title}</h3>
            {aboutPage.secondary_description && <p className="mt-2 text-[var(--muted)]">{aboutPage.secondary_description}</p>}
          </Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {experience.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.04}>
                <article className="liquid-card h-full rounded-3xl p-7">
                  <div className="flex flex-wrap justify-between gap-3">
                    <h4 className="text-xl font-bold">{item.role}</h4>
                    <span className="text-sm text-[var(--muted)]">{item.company}</span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--accent)]">{item.start_date}{item.end_date ? ` — ${item.end_date}` : " — Present"}</p>
                  <p className="mt-4 leading-7 text-[var(--muted)]">{item.description}</p>
                </article>
              </Reveal>
            ))}
            {!experience.length && <p className="text-[var(--muted)]">Experience entries can be managed from the portfolio dashboard.</p>}
          </div>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-24">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--accent)]">{projectsPage.eyebrow}</p>
          <h2 className="mt-3 text-4xl font-black sm:text-6xl">{projectsPage.title}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{projectsPage.description}</p>
        </Reveal>
        {projectsPage.section_title && <h3 className="mt-12 text-2xl font-bold">{projectsPage.section_title}</h3>}
        <div className="mt-8 grid items-start gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.04}>
              <article className="liquid-card group overflow-hidden rounded-3xl">
                <div className="relative aspect-[16/9] overflow-hidden bg-white/[.04]">
                  {project.image_url ? <img src={project.image_url} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--accent),transparent_35%),linear-gradient(135deg,rgba(255,255,255,.08),transparent)]" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{project.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag.id} className="rounded-full bg-white/5 px-3 py-1 text-xs text-[var(--muted)]">{tag.name}</span>)}</div>
                  <ProjectDetails description={project.description} />
                  <div className="mt-5 flex flex-wrap gap-3 text-sm">
                    {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="text-[var(--accent)]">Live site <ArrowUpRight className="inline" size={15} /></a>}
                    {project.repo_url && <a href={project.repo_url} target="_blank" rel="noreferrer" className="text-[var(--muted)]">Repository <ArrowUpRight className="inline" size={15} /></a>}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
          {!projects.length && <p className="text-[var(--muted)]">Projects will appear here when they are added in the portfolio dashboard.</p>}
        </div>
      </section>

      <section id="blog" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-24">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--accent)]">{blogPage.eyebrow}</p>
          <h2 className="mt-3 text-4xl font-black sm:text-6xl">{blogPage.title}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{blogPage.description}</p>
        </Reveal>
        <div className="mt-10 grid gap-5">
          {posts.map((post, index) => (
            <Reveal key={post.id} delay={index * 0.04}>
              <article className="liquid-card rounded-3xl p-6 sm:p-8">
                <p className="text-sm text-[var(--muted)]">{post.published_at && new Date(post.published_at).toLocaleDateString()}</p>
                <h3 className="mt-2 text-2xl font-bold">{post.title}</h3>
                <p className="mt-2 text-[var(--muted)]">{post.excerpt}</p>
                <details className="mt-5 border-t border-[var(--border)] pt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--accent)]">Read article</summary>
                  {post.cover_url && <img src={post.cover_url} alt="" className="mt-4 max-h-96 w-full rounded-2xl object-cover" />}
                  <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{post.content}</div>
                </details>
              </article>
            </Reveal>
          ))}
          {!posts.length && <div className="liquid-card rounded-3xl p-8 text-[var(--muted)]">Technical articles can be published from the portfolio dashboard.</div>}
        </div>
      </section>

      {customPages.map((page) => (
        <section key={page.slug} id={page.slug} className="mx-auto max-w-6xl scroll-mt-28 px-4 py-24">
          <Reveal>
            {page.eyebrow && <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--accent)]">{page.eyebrow}</p>}
            <h2 className="mt-3 text-4xl font-black sm:text-6xl">{page.title}</h2>
            {page.description && <p className="mt-6 max-w-3xl whitespace-pre-wrap text-lg leading-8 text-[var(--muted)]">{page.description}</p>}
          </Reveal>
          {(page.section_title || page.section_description) && (
            <div className="liquid-card mt-10 rounded-3xl p-7 sm:p-9">
              {page.section_title && <h3 className="text-2xl font-bold">{page.section_title}</h3>}
              {page.section_description && <p className="mt-4 whitespace-pre-wrap leading-8 text-[var(--muted)]">{page.section_description}</p>}
            </div>
          )}
          {(page.secondary_title || page.secondary_description) && (
            <div className="mt-8 rounded-3xl border border-[var(--border)] p-7 sm:p-9">
              {page.secondary_title && <h3 className="text-2xl font-bold">{page.secondary_title}</h3>}
              {page.secondary_description && <p className="mt-4 whitespace-pre-wrap leading-8 text-[var(--muted)]">{page.secondary_description}</p>}
            </div>
          )}
          {(page.cta_title || page.cta_description) && (
            <div className="liquid-card mt-8 rounded-3xl p-7">
              {page.cta_title && <h3 className="text-xl font-bold">{page.cta_title}</h3>}
              {page.cta_description && <p className="mt-2 whitespace-pre-wrap text-[var(--muted)]">{page.cta_description}</p>}
            </div>
          )}
        </section>
      ))}

      <section id="contact" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-24">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--accent)]">{contactPage.eyebrow}</p>
          <h2 className="mt-3 text-4xl font-black sm:text-6xl">{contactPage.title}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{contactPage.description}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-[.65fr_1.35fr]">
          <Reveal>
            <div className="liquid-card rounded-3xl p-7">
              <div className="flex items-start gap-4"><Mail className="text-[var(--accent)]" /><div><p className="font-bold">Email</p><a className="mt-1 block text-sm text-[var(--muted)]" href={`mailto:${profile.email}`}>{profile.email}</a></div></div>
              <div className="mt-7 flex items-start gap-4"><MapPin className="text-[var(--accent)]" /><div><p className="font-bold">Location</p><p className="mt-1 text-sm text-[var(--muted)]">{profile.location || "Remote"}</p></div></div>
              <div className="mt-7 flex flex-wrap gap-4 text-sm">
                {profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer" aria-label={`GitHub: ${profile.github_url}`} className="inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--accent)]"><Github size={18} />GitHub</a>}
                {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" aria-label={`LinkedIn: ${profile.linkedin_url}`} className="inline-flex items-center gap-2 text-[var(--muted)] transition hover:text-[var(--accent)]"><Linkedin size={18} />LinkedIn</a>}
              </div>
              {contactPage.section_title && <h3 className="mt-8 font-bold">{contactPage.section_title}</h3>}
              {contactPage.section_description && <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{contactPage.section_description}</p>}
            </div>
          </Reveal>
          <Reveal delay={0.1}><ContactForm /></Reveal>
        </div>
      </section>
    </div>
  );
}
