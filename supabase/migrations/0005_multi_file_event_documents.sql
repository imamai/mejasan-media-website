-- ============================================================
-- Migration: allow more than one file per shared event-document link/QR code
-- Run this once in: Supabase Dashboard (project sedsjjmjnikppfaecaya)
--   -> SQL Editor -> New query -> paste this whole file -> Run
-- Safe to re-run: every statement is idempotent.
--
-- Why: mejasan_event_documents previously stored exactly one file per row
-- (file_url/file_name/file_type), so a single shared link/QR could only
-- carry one document (e.g. just the eulogy, not the eulogy + program).
-- This adds a child table so one link can carry several files, while
-- keeping file_url/file_name/file_type on the parent row in sync with the
-- first file for backward compatibility with anything still reading it.
-- ============================================================

create table if not exists mejasan_event_document_files (
  id                 uuid primary key default uuid_generate_v4(),
  event_document_id  uuid references mejasan_event_documents(id) on delete cascade not null,
  url                text not null,
  name               text not null,
  type               text,
  sort_order         int not null default 0,
  created_at         timestamptz not null default now()
);

create index if not exists idx_mejasan_event_document_files_doc on mejasan_event_document_files(event_document_id, sort_order);

alter table mejasan_event_document_files enable row level security;

drop policy if exists "Admins manage event document files" on mejasan_event_document_files;
create policy "Admins manage event document files" on mejasan_event_document_files for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- Backfill: carry each existing single-file row into the new child table
insert into mejasan_event_document_files (event_document_id, url, name, type, sort_order)
select id, file_url, coalesce(file_name, 'document'), file_type, 0
from mejasan_event_documents d
where file_url is not null
  and not exists (
    select 1 from mejasan_event_document_files f where f.event_document_id = d.id
  );
