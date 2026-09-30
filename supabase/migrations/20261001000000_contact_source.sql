-- The Scribble Lab: short contact messages share the inquiries table with detailed briefs.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run. Safe to run more than once.
--
-- What it changes:
--   * adds `source` ('project' or 'contact'), `topic` and `message`
--   * lets the brief-only columns be empty, but ONLY for contact messages:
--     a CHECK constraint still requires every brief field when source = 'project'
-- What it does not change:
--   * existing rows (they all become source = 'project' and already satisfy the constraint)
--   * Row Level Security: still ON, still no policies for anon or authenticated

alter table public.inquiries add column if not exists source  text not null default 'project';
alter table public.inquiries add column if not exists topic   text;
alter table public.inquiries add column if not exists message text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'inquiries_source_check') then
    alter table public.inquiries add constraint inquiries_source_check check (source in ('project', 'contact'));
  end if;
end $$;

alter table public.inquiries alter column types    drop not null;
alter table public.inquiries alter column location drop not null;
alter table public.inquiries alter column scale    drop not null;
alter table public.inquiries alter column brief    drop not null;
alter table public.inquiries alter column timing   drop not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'inquiries_source_shape') then
    alter table public.inquiries add constraint inquiries_source_shape check (
      (source = 'project' and types is not null and location is not null and scale is not null and brief is not null and timing is not null)
      or
      (source = 'contact' and topic is not null and message is not null)
    );
  end if;
end $$;

create index if not exists inquiries_source_idx on public.inquiries (source, created_at desc);

-- Belt and braces: the public roles still have no access.
alter table public.inquiries enable row level security;
revoke all on public.inquiries from anon, authenticated;
