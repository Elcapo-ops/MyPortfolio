import { api } from "@/lib/api";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import type { PortfolioPage, Project } from "@/types";

export const dynamic = "force-dynamic";

export default async function Projects() {
  const [projects, page] = await Promise.all([
    api<Project[]>("/projects/"),
    api<PortfolioPage>("/pages/projects/")
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-24">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--accent)]">{page.eyebrow}</p>
        <h1 className="mt-3 text-5xl font-black sm:text-7xl">{page.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{page.description}</p>
      </Reveal>
      {page.section_title && <h2 className="mt-14 text-2xl font-bold">{page.section_title}</h2>}
      <div className="mt-8 grid gap-6 md:grid-cols-2">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
    </div>
  );
}
