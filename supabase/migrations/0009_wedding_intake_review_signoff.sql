-- ============================================================
-- Migration: Admin review sign-off for wedding intake contracts
-- Run this once in: Supabase Dashboard (project sedsjjmjnikppfaecaya)
--   -> SQL Editor -> New query -> paste this whole file -> Run
-- Requires 0007_wedding_intake_form.sql to have run first.
--
-- Adds an invoice number and a Mejasan Media office sign-off (distinct from
-- the on-site "Company Rep" signature captured on the public form) that is
-- applied by an admin from the dashboard when marking a submission
-- "reviewed". That action stamps a fully signed contract PDF and emails it
-- to the client + info@mejasanmedia.com. Safe to re-run.
-- ============================================================

alter table mejasan_wedding_intake
  add column if not exists invoice_number         text,
  add column if not exists company_signoff_name    text,
  add column if not exists company_signoff_title   text,
  add column if not exists company_signoff_at      timestamptz,
  add column if not exists reviewed_by             text,
  add column if not exists reviewed_at             timestamptz,
  add column if not exists signed_contract_pdf_url text,
  add column if not exists client_notified_at      timestamptz;
