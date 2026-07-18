-- Run this in the Supabase SQL editor.
create table if not exists public.beta_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Lock the table down; the app writes via the service_role key (server-side only).
alter table public.beta_signups enable row level security;
