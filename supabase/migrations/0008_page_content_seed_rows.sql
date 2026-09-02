-- ============================================================
-- Migration: New page_content rows (Portfolio/Blog/Legal/Booking/
-- Wedding-form) + client tags column
-- Run this once in: Supabase Dashboard (project sedsjjmjnikppfaecaya)
--   -> SQL Editor -> New query -> paste this whole file -> Run
--
-- Adds empty 'portfolio', 'blog', 'privacy', 'terms', 'booking' and
-- 'wedding-form' rows to mejasan_page_content — each page falls back to
-- today's real copy until an admin edits it in Admin -> Pages. Also adds a
-- 'tags' column to mejasan_client_profiles (the one new column needed for
-- the CRM notes/tags work — mejasan_invoices, mejasan_activity_logs,
-- mejasan_notifications and mejasan_client_profiles.notes already exist).
-- Safe to re-run.
-- ============================================================

insert into mejasan_page_content (page_slug, content) values
  ('portfolio', '{}'),
  ('blog', '{}'),
  ('privacy', '{}'),
  ('terms', '{}'),
  ('booking', '{}'),
  ('wedding-form', '{}'),
  ('gallery', '{}')
on conflict (page_slug) do nothing;

alter table mejasan_client_profiles add column if not exists tags text[] default '{}';
