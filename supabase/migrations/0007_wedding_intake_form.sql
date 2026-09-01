-- ============================================================
-- Migration: Wedding intake form (questionnaire + interview guide + contract)
-- Run this once in: Supabase Dashboard (project sedsjjmjnikppfaecaya)
--   -> SQL Editor -> New query -> paste this whole file -> Run
-- Requires 0004_admin_role_and_video_bucket.sql (mejasan_is_admin) to have
-- run first.
--
-- Fully isolated from mejasan_bookings / mejasan_contracts / any existing
-- table — a public wedding-form submission never touches those. Signature
-- images are stored in the existing 'mejasan-media' bucket and the generated
-- Questionnaire/Contract PDFs in 'mejasan-event-docs' (PDFs aren't an
-- allowed MIME type on mejasan-media). Both uploads happen server-side with
-- the service-role client, so the buckets' admin-only storage RLS is
-- untouched. Safe to re-run.
-- ============================================================

create table if not exists mejasan_wedding_intake (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  status          text not null default 'submitted' check (status in ('submitted','reviewed')),
  bride_name      text not null,
  groom_name      text not null,
  wedding_date    date not null,
  client_email    text not null,
  client_phone    text,
  questionnaire   jsonb not null default '{}',
  contract        jsonb not null default '{}',
  signature_client_url          text,
  signature_witness_url         text,
  signature_company_url         text,
  signature_company_witness_url text,
  questionnaire_pdf_url text,
  contract_pdf_url      text,
  is_correction   boolean not null default false,
  correction_of   uuid references mejasan_wedding_intake(id)
);

create index if not exists idx_wedding_intake_email_date on mejasan_wedding_intake(client_email, wedding_date);
create index if not exists idx_wedding_intake_created     on mejasan_wedding_intake(created_at desc);

alter table mejasan_wedding_intake enable row level security;

drop policy if exists "Anyone can submit wedding intake" on mejasan_wedding_intake;
create policy "Anyone can submit wedding intake" on mejasan_wedding_intake
  for insert with check (true);

-- No public SELECT policy: this table holds phone numbers, signature image
-- URLs and cost figures. The public form never queries it directly — the
-- duplicate-check and submit API routes use the service-role client, which
-- bypasses RLS, so only admins (via the dashboard) can read rows.

drop policy if exists "Admins manage wedding intake" on mejasan_wedding_intake;
create policy "Admins manage wedding intake" on mejasan_wedding_intake
  for all using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));
