"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error ?? "Something went wrong — try again");
        setStatus("error");
      }
    } catch {
      setError("Network error — try again");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-center text-emerald-300">
        You&apos;re on the list. I&apos;ll email you when the beta opens.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base text-zinc-100 outline-none focus:border-emerald-500"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Get the beta"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-400 sm:basis-full">{error}</p>
      )}
    </form>
  );
}
