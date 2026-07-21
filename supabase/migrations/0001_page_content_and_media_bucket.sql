-- ============================================================
-- Migration: mejasan_page_content table + mejasan-media storage bucket
-- Run this once in: Supabase Dashboard (project sedsjjmjnikppfaecaya)
--   -> SQL Editor -> New query -> paste this whole file -> Run
-- Safe to re-run: every statement is idempotent.
-- ============================================================

-- ── Page content table (About + Services copy/images, editable from /admin) ──

create table if not exists mejasan_page_content (
  id          uuid primary key default uuid_generate_v4(),
  page_slug   text not null unique,
  content     jsonb not null default '{}',
  updated_at  timestamptz not null default now()
);

alter table mejasan_page_content enable row level security;

drop trigger if exists trg_mejasan_page_content_updated_at on mejasan_page_content;
create trigger trg_mejasan_page_content_updated_at
  before update on mejasan_page_content
  for each row execute procedure mejasan_set_updated_at();

drop policy if exists "Public view page content" on mejasan_page_content;
create policy "Public view page content" on mejasan_page_content for select
  using (true);

drop policy if exists "Admins manage page content" on mejasan_page_content;
create policy "Admins manage page content" on mejasan_page_content for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

insert into mejasan_page_content (page_slug, content) values
  ('about',                  '{}'),
  ('services',               '{}'),
  ('services-photography',   '{}'),
  ('services-videography',  '{}'),
  ('services-events',        '{}'),
  ('services-drone',         '{}'),
  ('services-branding',      '{}')
on conflict (page_slug) do nothing;

-- ── Storage bucket used by the admin's image upload (Gallery tab + Pages editor) ──
-- This bucket already exists in code (src/app/admin/page.tsx) but was never
-- actually created — only sketched as a comment in supabase/schema.sql.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mejasan-media', 'mejasan-media', true, 20971520, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

drop policy if exists "Public read mejasan-media" on storage.objects;
create policy "Public read mejasan-media" on storage.objects for select
  using (bucket_id = 'mejasan-media');

drop policy if exists "Admins upload mejasan-media" on storage.objects;
create policy "Admins upload mejasan-media" on storage.objects for insert
  with check (bucket_id = 'mejasan-media' and mejasan_is_admin(auth.uid()));

drop policy if exists "Admins update mejasan-media" on storage.objects;
create policy "Admins update mejasan-media" on storage.objects for update
  using (bucket_id = 'mejasan-media' and mejasan_is_admin(auth.uid()));

drop policy if exists "Admins delete mejasan-media" on storage.objects;
create policy "Admins delete mejasan-media" on storage.objects for delete
  using (bucket_id = 'mejasan-media' and mejasan_is_admin(auth.uid()));

-- ============================================================
-- Event documents (eulogies, programs, etc.) — admin uploads a file for a
-- named event and shares it with clients via a private link + QR code.
-- Deliberately admin-only RLS (no public row policy): the public page at
-- /e/[token] looks up the single matching row server-side using the
-- service-role client, so the anon key can never bulk-list every event's
-- name/description/file the way a public SELECT policy would allow.
-- ============================================================

create table if not exists mejasan_event_documents (
  id            uuid primary key default uuid_generate_v4(),
  event_name    text not null,
  description   text,
  booking_id    uuid references mejasan_bookings(id),
  file_url      text not null,
  file_name     text,
  file_type     text,
  access_token  text not null unique default replace(uuid_generate_v4()::text, '-', ''),
  is_active     boolean not null default true,
  view_count    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table mejasan_event_documents enable row level security;

drop trigger if exists trg_mejasan_event_documents_updated_at on mejasan_event_documents;
create trigger trg_mejasan_event_documents_updated_at
  before update on mejasan_event_documents
  for each row execute procedure mejasan_set_updated_at();

drop policy if exists "Admins manage event documents" on mejasan_event_documents;
create policy "Admins manage event documents" on mejasan_event_documents for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- Bucket: mejasan-event-docs (public) — PDFs/docs shared via the link/QR above.
-- Public read is required so the shared link works with no login; the random
-- access_token in the DB row (not the storage path) is the actual secret.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mejasan-event-docs', 'mejasan-event-docs', true, 52428800, array['application/pdf','image/jpeg','image/png','image/webp','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

drop policy if exists "Public read mejasan-event-docs" on storage.objects;
create policy "Public read mejasan-event-docs" on storage.objects for select
  using (bucket_id = 'mejasan-event-docs');

drop policy if exists "Admins upload mejasan-event-docs" on storage.objects;
create policy "Admins upload mejasan-event-docs" on storage.objects for insert
  with check (bucket_id = 'mejasan-event-docs' and mejasan_is_admin(auth.uid()));

drop policy if exists "Admins update mejasan-event-docs" on storage.objects;
create policy "Admins update mejasan-event-docs" on storage.objects for update
  using (bucket_id = 'mejasan-event-docs' and mejasan_is_admin(auth.uid()));

drop policy if exists "Admins delete mejasan-event-docs" on storage.objects;
create policy "Admins delete mejasan-event-docs" on storage.objects for delete
  using (bucket_id = 'mejasan-event-docs' and mejasan_is_admin(auth.uid()));
