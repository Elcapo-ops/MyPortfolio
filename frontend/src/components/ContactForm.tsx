"use client";
import { useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { API_URL } from "@/lib/api";

type ContactResponse = { detail?: string; email_sent?: boolean };
type Toast = { type: "success" | "error"; message: string };

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [toast, setToast] = useState<Toast | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("loading");
    setToast(null);

    try {
      const response = await fetch(`${API_URL}/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const result = await response.json() as ContactResponse;
      if (!response.ok) throw new Error(result.detail || "Something went wrong. Please try again.");

      if (result.email_sent === false) {
        setState("error");
        setToast({ type: "error", message: result.detail || "Your message was saved, but its email notification could not be delivered." });
        form.reset();
        return;
      }

      setState("success");
      setToast({ type: "success", message: result.detail || "Message sent successfully." });
      form.reset();
    } catch (error) {
      setState("error");
      setToast({ type: "error", message: error instanceof Error ? error.message : "Something went wrong. Please try again." });
    }
  }

  return (
    <>
      <form onSubmit={submit} className="liquid-card rounded-3xl p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm text-[var(--muted)]">Name<input required name="name" className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white/5 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)]" /></label>
          <label className="text-sm text-[var(--muted)]">Email<input required type="email" name="email" className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white/5 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)]" /></label>
        </div>
        <label className="mt-5 block text-sm text-[var(--muted)]">Message<textarea required name="message" rows={6} className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-white/5 px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)]" /></label>
        <div className="mt-5">
          <button disabled={state === "loading"} className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white transition hover:scale-[1.02] disabled:opacity-60">{state === "loading" ? "Sending…" : "Send message"}</button>
        </div>
      </form>
      {toast && (
        <div
          role={toast.type === "success" ? "status" : "alert"}
          className={`fixed bottom-6 right-6 z-[100] flex w-[min(24rem,calc(100vw-3rem))] items-start gap-3 rounded-2xl border p-4 text-sm shadow-2xl backdrop-blur-xl ${
            toast.type === "success"
              ? "border-emerald-300/30 bg-emerald-950/95 text-emerald-50"
              : "border-red-300/30 bg-red-950/95 text-red-50"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="mt-0.5 shrink-0" size={19} /> : <AlertCircle className="mt-0.5 shrink-0" size={19} />}
          <p className="flex-1 leading-6">{toast.message}</p>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification" className="shrink-0 rounded-md p-1 opacity-75 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            <X size={17} />
          </button>
        </div>
      )}
    </>
  );
}
