import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import { Reveal } from "@/components/Reveal";
import type { BlogPost, PortfolioPage } from "@/types";

export const dynamic = "force-dynamic";

export default async function Blog() {
  const [posts, page] = await Promise.all([
    api<BlogPost[]>("/blog/"),
    api<PortfolioPage>("/pages/blog/")
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-24">
      <Reveal>
        <p className="text-sm font-bold uppercase tracking-[.2em] text-[var(--accent)]">{page.eyebrow}</p>
        <h1 className="mt-3 text-5xl font-black sm:text-7xl">{page.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{page.description}</p>
      </Reveal>
      <div className="mt-14 grid gap-5">
        {posts.length ? posts.map((post, index) => (
          <Reveal key={post.id} delay={index * 0.05}>
            <Link href={`/blog/${post.slug}`} className="liquid-card flex items-center justify-between gap-6 rounded-3xl p-7 transition hover:-translate-y-1">
              <div>
                <p className="text-sm text-[var(--muted)]">{post.published_at && new Date(post.published_at).toLocaleDateString()}</p>
                <h2 className="mt-2 text-2xl font-bold">{post.title}</h2>
                <p className="mt-2 max-w-2xl text-[var(--muted)]">{post.excerpt}</p>
              </div>
              <ArrowUpRight className="shrink-0" />
            </Link>
          </Reveal>
        )) : <div className="liquid-card rounded-3xl p-8 text-[var(--muted)]">Technical articles can be published from the portfolio dashboard.</div>}
      </div>
    </div>
  );
}
