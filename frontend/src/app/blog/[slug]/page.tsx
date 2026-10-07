import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { BlogPost } from "@/types";
export const dynamic = "force-dynamic";
export default async function Post({params}:{params:Promise<{slug:string}>}){const {slug}=await params;let p:BlogPost;try{p=await api<BlogPost>(`/blog/${slug}/`)}catch{notFound()}return <article className="mx-auto max-w-3xl px-4 py-24"><p className="text-sm text-[var(--muted)]">{p.published_at&&new Date(p.published_at).toLocaleDateString()}</p><h1 className="mt-3 text-5xl font-black">{p.title}</h1><p className="mt-6 text-xl leading-8 text-[var(--muted)]">{p.excerpt}</p><div className="prose prose-invert mt-12 max-w-none whitespace-pre-wrap leading-8 text-[var(--muted)]">{p.content}</div></article>}
