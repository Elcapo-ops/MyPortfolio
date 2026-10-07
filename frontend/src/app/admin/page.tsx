"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BriefcaseBusiness, Check, ChevronRight, FileImage, FileText,
  LayoutDashboard, LogOut, Mail, Palette, Pencil, Plus, Save, Settings2,
  Tags, Trash2, UserRound, Wrench, X
} from "lucide-react";
import { API_URL, BrowserApiError, browserApi } from "@/lib/api";

type Section = "overview" | "profile" | "pages" | "projects" | "skills" | "experience" | "blog" | "tags" | "messages" | "appearance";
type FieldKind = "text" | "textarea" | "number" | "checkbox" | "date" | "datetime" | "image" | "file" | "select" | "multiselect";
type Field = { name: string; label: string; kind?: FieldKind; required?: boolean; options?: string[]; help?: string };
type FormValue = string | number | boolean | number[] | File | null;
type RecordData = Record<string, unknown>;
type PortfolioForm = Record<string, FormValue>;
type Collection = { title: string; endpoint: string; fields: Field[]; display: string; subtitle?: string; fixed?: boolean; deletable?: boolean };

const themes = ["blue", "light", "purple", "green", "minimal", "sunset"];
const builtInPages = ["home", "about", "projects", "blog", "contact"];

const collections: Partial<Record<Section, Collection>> = {
  profile: {
    title: "Profile",
    endpoint: "profile",
    display: "name",
    fixed: true,
    fields: [
      { name: "name", label: "Display name", required: true },
      { name: "headline", label: "Professional headline", required: true },
      { name: "bio", label: "Biography", kind: "textarea", required: true },
      { name: "avatar", label: "Profile picture", kind: "image", help: "Upload a square image for the home page and profile card." },
      { name: "cv", label: "CV / resume", kind: "file" },
      { name: "location", label: "Location" },
      { name: "email", label: "Contact email", required: true },
      { name: "github_url", label: "GitHub URL" },
      { name: "linkedin_url", label: "LinkedIn URL" },
      { name: "website_url", label: "Website URL" }
    ]
  },
  pages: {
    title: "Pages",
    endpoint: "pages",
    display: "title",
    subtitle: "slug",
    deletable: true,
    fields: [
      { name: "slug", label: "Page URL slug", required: true, help: "Use lowercase letters and hyphens, e.g. services or testimonials." },
      { name: "eyebrow", label: "Eyebrow / small label" },
      { name: "title", label: "Page headline", required: true },
      { name: "description", label: "Introduction", kind: "textarea" },
      { name: "section_title", label: "Section heading" },
      { name: "section_description", label: "Section description", kind: "textarea" },
      { name: "secondary_title", label: "Second section heading" },
      { name: "secondary_description", label: "Second section description", kind: "textarea" },
      { name: "cta_title", label: "Call-to-action heading" },
      { name: "cta_description", label: "Call-to-action text", kind: "textarea" },
      { name: "show_in_navigation", label: "Show page in navigation", kind: "checkbox" },
      { name: "sort_order", label: "Navigation order", kind: "number" }
    ]
  },
  projects: {
    title: "Projects",
    endpoint: "projects",
    display: "title",
    subtitle: "slug",
    fields: [
      { name: "title", label: "Project title", required: true },
      { name: "slug", label: "URL slug", required: true },
      { name: "summary", label: "Short summary", required: true },
      { name: "description", label: "Full description", kind: "textarea", required: true },
      { name: "image", label: "Project image", kind: "image" },
      { name: "live_url", label: "Live website URL" },
      { name: "repo_url", label: "Repository URL" },
      { name: "tag_ids", label: "Project tags", kind: "multiselect" },
      { name: "featured", label: "Feature on home page", kind: "checkbox" },
      { name: "sort_order", label: "Display order", kind: "number" }
    ]
  },
  skills: {
    title: "Skills",
    endpoint: "skills",
    display: "name",
    subtitle: "category",
    fields: [
      { name: "name", label: "Skill name", required: true },
      { name: "category", label: "Category", kind: "select", options: ["Frontend", "Backend", "Database", "DevOps", "Architecture", "Tools"], required: true },
      { name: "level", label: "Proficiency (0–100)", kind: "number" },
      { name: "sort_order", label: "Display order", kind: "number" }
    ]
  },
  experience: {
    title: "Experience",
    endpoint: "experience",
    display: "role",
    subtitle: "company",
    fields: [
      { name: "role", label: "Role", required: true },
      { name: "company", label: "Company", required: true },
      { name: "description", label: "Description", kind: "textarea", required: true },
      { name: "start_date", label: "Start date", kind: "date", required: true },
      { name: "end_date", label: "End date", kind: "date" },
      { name: "sort_order", label: "Display order", kind: "number" }
    ]
  },
  blog: {
    title: "Blog posts",
    endpoint: "blog",
    display: "title",
    subtitle: "slug",
    fields: [
      { name: "title", label: "Post title", required: true },
      { name: "slug", label: "URL slug", required: true },
      { name: "excerpt", label: "Excerpt", kind: "textarea", required: true },
      { name: "content", label: "Article content", kind: "textarea", required: true },
      { name: "cover", label: "Cover image", kind: "image" },
      { name: "published", label: "Published", kind: "checkbox" },
      { name: "published_at", label: "Publish date", kind: "datetime" }
    ]
  },
  tags: {
    title: "Tags",
    endpoint: "tags",
    display: "name",
    subtitle: "slug",
    fields: [
      { name: "name", label: "Tag name", required: true },
      { name: "slug", label: "URL slug", required: true }
    ]
  },
  messages: {
    title: "Messages",
    endpoint: "messages",
    display: "name",
    subtitle: "email",
    deletable: true,
    fields: [
      { name: "name", label: "Sender", required: true },
      { name: "email", label: "Email", required: true },
      { name: "message", label: "Message", kind: "textarea", required: true },
      { name: "read", label: "Mark as read", kind: "checkbox" }
    ]
  },
  appearance: {
    title: "Appearance",
    endpoint: "site-settings",
    display: "default_theme",
    fixed: true,
    fields: [
      { name: "default_theme", label: "Default site theme", kind: "select", options: themes, required: true }
    ]
  }
};

const navigation: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "pages", label: "Pages", icon: FileText },
  { id: "projects", label: "Projects", icon: BriefcaseBusiness },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "tags", label: "Tags", icon: Tags },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "appearance", label: "Appearance", icon: Palette }
];

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function identityFor(section: Section, item: RecordData): string {
  if (section === "pages") return String(item.slug);
  if (section === "projects" || section === "blog") return String(item.slug);
  if (section === "appearance") return "site";
  return String(item.id);
}

function initialForm(section: Section, record?: RecordData): PortfolioForm {
  const collection = collections[section];
  const values: PortfolioForm = {};
  collection?.fields.forEach((field) => {
    const current = record?.[field.name];
    if (field.kind === "image" || field.kind === "file") {
      values[`${field.name}_url`] = String(record?.[`${field.name}_url`] ?? "");
      return;
    }
    if (field.name === "tag_ids") {
      const tags = Array.isArray(record?.tags) ? record.tags : [];
      values.tag_ids = tags.map((tag) => Number((tag as RecordData).id));
    } else if (field.kind === "datetime" && typeof current === "string" && current) {
      values[field.name] = current.slice(0, 16);
    } else if (current === null || current === undefined) {
      values[field.name] = field.kind === "checkbox" ? false : "";
    } else if (typeof current === "string" || typeof current === "number" || typeof current === "boolean") {
      values[field.name] = current;
    }
  });
  if (section === "appearance" && !values.default_theme) values.default_theme = "blue";
  if (section === "pages" && !record) values.show_in_navigation = true;
  return values;
}

export default function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [section, setSection] = useState<Section>("overview");
  const [records, setRecords] = useState<RecordData[]>([]);
  const [tagOptions, setTagOptions] = useState<RecordData[]>([]);
  const [editing, setEditing] = useState<RecordData | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<PortfolioForm>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectedCollection = collections[section];
  const readToken = useCallback(() => token ?? localStorage.getItem("portfolio_access"), [token]);

  const requireSignInAgain = useCallback((message = "Your session expired. Sign in again to continue.") => {
    localStorage.removeItem("portfolio_access");
    localStorage.removeItem("portfolio_refresh");
    setToken(null);
    setRecords([]);
    setEditing(null);
    setEditorOpen(false);
    setError(message);
  }, []);

  const loadSection = useCallback(async (target: Section, authToken: string) => {
    if (target === "overview") return;
    const config = collections[target];
    if (!config) return;
    setLoading(true);
    setError("");
    try {
      const data = await browserApi<unknown>(`/${config.endpoint}/`, {}, authToken);
      const rows = Array.isArray(data) ? data as RecordData[] : [data as RecordData];
      setRecords(rows);
      if (!rows.length && (target === "profile" || target === "appearance")) {
        setEditing(null);
        setEditorOpen(true);
        setForm(initialForm(target));
      }
      if (target === "projects") {
        const tags = await browserApi<RecordData[]>("/tags/", {}, authToken);
        setTagOptions(tags);
      }
    } catch (cause) {
      if (cause instanceof BrowserApiError && cause.status === 401) {
        requireSignInAgain();
      } else {
        setError(cause instanceof Error ? cause.message : "Could not load this section.");
      }
    } finally {
      setLoading(false);
    }
  }, [requireSignInAgain]);

  useEffect(() => {
    const stored = localStorage.getItem("portfolio_access");
    if (stored) {
      setToken(stored);
      void loadSection(section, stored);
    }
  }, [loadSection, section]);

  const counts = useMemo(() => records.length, [records]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error("These credentials could not sign you in.");
      const data = await response.json() as { access: string; refresh: string };
      localStorage.setItem("portfolio_access", data.access);
      localStorage.setItem("portfolio_refresh", data.refresh);
      setToken(data.access);
      await loadSection(section, data.access);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(record?: RecordData) {
    if (!selectedCollection) return;
    setEditing(record ?? null);
    setEditorOpen(true);
    setForm(initialForm(section, record));
    setError("");
    setNotice("");
  }

  async function saveRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const authToken = readToken();
    const config = collections[section];
    if (!authToken || !config) return;
    setSaving(true);
    setError("");
    setNotice("");

    const formData = new FormData();
    const jsonPayload: Record<string, string | number | boolean | number[]> = {};
    let hasFile = false;
    Object.entries(form).forEach(([key, value]) => {
      if (value === null || key.endsWith("_url")) return;
      if (value instanceof File) {
        formData.append(key, value);
        hasFile = true;
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, String(item)));
        jsonPayload[key] = value;
      } else {
        formData.append(key, String(value));
        jsonPayload[key] = value;
      }
    });
    const path = section === "appearance"
      ? "/site-settings/site/"
      : editing
        ? `/${config.endpoint}/${identityFor(section, editing)}/`
        : `/${config.endpoint}/`;

    try {
      await browserApi(path, {
        method: editing || section === "appearance" ? "PATCH" : "POST",
        body: hasFile ? formData : JSON.stringify(jsonPayload)
      }, authToken);
      setNotice(`${config.title} saved.`);
      setEditing(null);
      setEditorOpen(false);
      await loadSection(section, authToken);
    } catch (cause) {
      if (cause instanceof BrowserApiError && cause.status === 401) {
        requireSignInAgain();
      } else {
        setError(cause instanceof Error ? cause.message : `Could not save ${config.title.toLowerCase()}.`);
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecord(record: RecordData) {
    const authToken = readToken();
    const config = collections[section];
    if (!authToken || !config) return;
    if (!window.confirm(`Delete “${displayValue(record[config.display])}”? This cannot be undone.`)) return;
    setError("");
    try {
      await browserApi(`/${config.endpoint}/${identityFor(section, record)}/`, { method: "DELETE" }, authToken);
      setNotice("Item deleted.");
      await loadSection(section, authToken);
    } catch (cause) {
      if (cause instanceof BrowserApiError && cause.status === 401) {
        requireSignInAgain();
      } else {
        setError(cause instanceof Error ? cause.message : "Could not delete this item.");
      }
    }
  }

  function logout() {
    localStorage.removeItem("portfolio_access");
    localStorage.removeItem("portfolio_refresh");
    setToken(null);
    setRecords([]);
    setEditing(null);
    setEditorOpen(false);
    setError("");
    setNotice("");
  }

  function setField(name: string, value: FormValue) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function renderField(field: Field) {
    const value = form[field.name];
    const inputClass = "mt-2 w-full rounded-xl border border-[var(--border)] bg-slate-950/40 px-3 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]";
    const common = {
      id: field.name,
      required: field.required,
      className: inputClass
    };
    return (
      <label key={field.name} htmlFor={field.name} className="block text-sm font-medium">
        {field.label}
        {field.kind === "textarea" ? (
          <textarea {...common} rows={field.name === "content" || field.name === "bio" ? 8 : 4} value={typeof value === "string" ? value : ""} onChange={(event) => setField(field.name, event.target.value)} />
        ) : field.kind === "checkbox" ? (
          <span className="mt-3 flex items-center gap-3">
            <input id={field.name} type="checkbox" checked={value === true} onChange={(event) => setField(field.name, event.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
            <span className="text-[var(--muted)]">Enabled</span>
          </span>
        ) : field.kind === "image" || field.kind === "file" ? (
          <>
            <input id={field.name} type="file" accept={field.kind === "image" ? "image/*" : undefined} onChange={(event) => setField(field.name, event.target.files?.[0] ?? null)} className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2`} />
            {field.kind === "image" && typeof form[`${field.name}_url`] === "string" && form[`${field.name}_url`] && (
              <img src={String(form[`${field.name}_url`])} alt="Current image" className="mt-3 h-24 w-24 rounded-xl border border-[var(--border)] object-cover" />
            )}
            {field.help && <span className="mt-2 block text-xs text-[var(--muted)]">{field.help}</span>}
          </>
        ) : field.kind === "select" || field.kind === "multiselect" ? (
          <select
            {...common}
            multiple={field.kind === "multiselect"}
            value={field.kind === "multiselect" ? (Array.isArray(value) ? value.map(String) : []) : String(value ?? "")}
            onChange={(event) => setField(field.name, field.kind === "multiselect"
              ? Array.from(event.currentTarget.selectedOptions, (option) => Number(option.value))
              : event.target.value)}
          >
            {field.kind === "select" && <option value="">Choose…</option>}
            {(field.name === "tag_ids" ? tagOptions.map((tag) => ({ value: String(tag.id), label: String(tag.name) })) : (field.options ?? []).map((option) => ({ value: option, label: option }))).map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          <input
            {...common}
            disabled={field.name === "slug" && section === "pages" && editing !== null}
            type={field.kind === "number" ? "number" : field.kind === "date" ? "date" : field.kind === "datetime" ? "datetime-local" : "text"}
            value={typeof value === "string" || typeof value === "number" ? value : ""}
            onChange={(event) => setField(field.name, field.kind === "number" ? Number(event.target.value) : event.target.value)}
          />
        )}
        {field.help && <span className="mt-2 block text-xs text-[var(--muted)]">{field.help}</span>}
      </label>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <div className="liquid-card rounded-3xl p-8 sm:p-10">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]"><Settings2 /></div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--accent)]">Portfolio control room</p>
          <h1 className="mt-3 text-3xl font-black">Sign in to manage your site</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Use your portfolio administrator account to edit the profile, pages, content, messages, and appearance.</p>
          <form onSubmit={login} className="mt-8 space-y-4">
            <label className="block text-sm">Email<input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white/5 p-3" /></label>
            <label className="block text-sm">Password<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] bg-white/5 p-3" /></label>
            {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
            <button disabled={loading} className="w-full rounded-full bg-[var(--accent)] px-5 py-3 font-bold text-white disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--accent)]">Portfolio control room</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Manage your portfolio</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Update every section of the public site from one place.</p>
        </div>
        <div className="flex gap-2">
          <a href="/" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:bg-white/5"><ArrowLeft className="mr-2 inline" size={15} />View site</a>
          <button onClick={logout} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:bg-white/5"><LogOut className="mr-2 inline" size={15} />Sign out</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="liquid-card h-fit rounded-2xl p-2">
          <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setSection(item.id); setEditing(null); setNotice(""); void loadSection(item.id, token); }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${section === item.id ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]"}`}
                >
                  <Icon size={17} />{item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          {section === "overview" ? (
            <div>
              <div className="mb-5">
                <p className="text-sm text-[var(--muted)]">Welcome back</p>
                <h2 className="mt-1 text-2xl font-bold">Your site, all in one place</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {navigation.filter((item) => item.id !== "overview").map((item) => {
                  const Icon = item.icon;
                  return <button key={item.id} onClick={() => { setSection(item.id); void loadSection(item.id, token); }} className="liquid-card rounded-2xl p-5 text-left transition hover:-translate-y-1 hover:border-[var(--accent)]"><div className="flex items-center justify-between"><Icon className="text-[var(--accent)]" size={20} /><ChevronRight size={17} className="text-[var(--muted)]" /></div><h3 className="mt-5 font-bold">{item.label}</h3><p className="mt-1 text-sm text-[var(--muted)]">{item.id === "profile" ? "Identity, photo, resume, and links" : item.id === "pages" ? "Headlines and copy across site pages" : item.id === "appearance" ? "Set the public site's default theme" : item.id === "messages" ? "Read and manage contact inquiries" : `Manage your ${item.label.toLowerCase()}`}</p></button>;
                })}
              </div>
            </div>
          ) : (
            <div className="liquid-card rounded-2xl p-5 sm:p-7">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]">Site management</p>
                  <h2 className="mt-2 text-2xl font-bold">{selectedCollection?.title}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{section === "pages" ? "Edit the visible headings and copy for each public page." : section === "appearance" ? "Choose the initial theme visitors see; visitors can still switch themes." : `${counts} ${counts === 1 ? "item" : "items"} managed here.`}</p>
                </div>
                {selectedCollection && !selectedCollection.fixed && section !== "messages" && (
                  <button onClick={() => startEditing()} className="rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-white"><Plus className="mr-1 inline" size={16} />{section === "pages" ? "Add page" : `Add ${selectedCollection.title.replace(/s$/, "")}`}</button>
                )}
              </div>

              {error && <p role="alert" className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
              {notice && <p role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-300"><Check size={16} />{notice}</p>}

              {editorOpen || (section === "profile" && records.length === 0) || (section === "appearance" && records.length === 0) ? (
                <form onSubmit={saveRecord} className="mb-6 rounded-2xl border border-[var(--border)] bg-white/[.025] p-4 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold">{editing ? `Edit ${selectedCollection?.title.replace(/s$/, "")}` : section === "profile" ? "Set up profile" : section === "appearance" ? "Default appearance" : `Add ${selectedCollection?.title.replace(/s$/, "")}`}</h3>
                    <button type="button" onClick={() => { setEditing(null); setEditorOpen(false); }} aria-label="Close editor" className="rounded-full p-2 text-[var(--muted)] hover:bg-white/10"><X size={18} /></button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedCollection?.fields
                      .filter((field) => !(section === "pages" && editing && builtInPages.includes(String(editing.slug)) && ["show_in_navigation", "sort_order"].includes(field.name)))
                      .map((field) => <div key={field.name} className={field.kind === "textarea" || field.kind === "multiselect" ? "md:col-span-2" : ""}>{renderField(field)}</div>)}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button disabled={saving} className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save className="mr-2 inline" size={16} />{saving ? "Saving…" : "Save changes"}</button>
                    <button type="button" onClick={() => { setEditing(null); setEditorOpen(false); }} className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm">Cancel</button>
                  </div>
                </form>
              ) : null}

              {loading ? <div className="rounded-xl border border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">Loading…</div> : (
                <div className="space-y-3">
                  {records.map((record) => (
                    <article key={identityFor(section, record)} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-white/[.02] p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        {section === "profile" && typeof record.avatar_url === "string" && record.avatar_url ? <img src={record.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover" /> : null}
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">                          {displayValue(record[selectedCollection?.display ?? "id"])}</h3>
                          <p className="mt-1 truncate text-sm text-[var(--muted)]">{section === "pages" ? displayValue(record.title) : displayValue(record[selectedCollection?.subtitle ?? ""])}</p>
                          {section === "messages" && <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{displayValue(record.message)}</p>}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {section === "messages" && <span className={`rounded-full px-2.5 py-1 text-xs ${record.read ? "bg-white/5 text-[var(--muted)]" : "bg-[var(--accent)]/15 text-[var(--accent)]"}`}>{record.read ? "Read" : "New"}</span>}
                        <button onClick={() => startEditing(record)} aria-label={`Edit ${displayValue(record[selectedCollection?.display ?? "id"])}`} className="rounded-full border border-[var(--border)] p-2.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"><Pencil size={15} /></button>
                        {selectedCollection?.deletable && (section !== "pages" || !builtInPages.includes(String(record.slug))) && <button onClick={() => void deleteRecord(record)} aria-label={`Delete ${displayValue(record[selectedCollection.display])}`} className="rounded-full border border-[var(--border)] p-2.5 hover:border-red-400 hover:text-red-400"><Trash2 size={15} /></button>}
                      </div>
                    </article>
                  ))}
                  {!records.length && section !== "profile" && section !== "appearance" && <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]"><FileImage className="mx-auto mb-3" size={22} />Nothing here yet. Use the add button to create your first item.</div>}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
