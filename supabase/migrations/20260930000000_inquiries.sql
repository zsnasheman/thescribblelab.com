-- The Scribble Lab: project inquiries.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.
--
-- Security model:
--   * Row Level Security is ON and there are NO policies for anon or authenticated,
--     so the public website key can neither read nor write this table.
--   * The website writes through a server action using the service-role key,
--     which bypasses RLS and never reaches the browser.
--   * A read policy for named admins is added when the management dashboard is built.

create table if not exists public.inquiries (
  id              uuid primary key default gen_random_uuid(),
  reference       text not null unique,
  created_at      timestamptz not null default now(),
  status          text not null default 'new' check (status in ('new','read','replied','archived')),

  types           text[] not null check (array_length(types, 1) >= 1),
  location        text not null,
  scale           text not null,
  size_note       text,
  brief           text not null,
  budget          text,
  timing          text not null,
  timing_note     text,

  name            text not null,
  email           text not null,
  phone           text,
  company         text,
  consent         boolean not null check (consent = true),

  idempotency_key uuid not null unique,
  ip_hash         text,
  user_agent      text
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_ip_hash_idx on public.inquiries (ip_hash, created_at desc);

alter table public.inquiries enable row level security;

-- Belt and braces: remove any default grants for the public roles.
revoke all on public.inquiries from anon, authenticated;
