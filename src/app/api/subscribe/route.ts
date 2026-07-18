import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email: unknown;
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Supabase env vars missing");
    return NextResponse.json(
      { error: "Signups aren't configured yet — try again later" },
      { status: 503 }
    );
  }

  const res = await fetch(`${url}/rest/v1/beta_signups`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates",
    },
    body: JSON.stringify({ email: email.toLowerCase().trim() }),
  });

  if (!res.ok && res.status !== 409) {
    console.error("Supabase insert failed", res.status, await res.text());
    return NextResponse.json(
      { error: "Something went wrong — try again" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
