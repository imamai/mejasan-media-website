-- ============================================================
-- Migration: Contact page + Site (footer/global) content rows
-- Run this once in: Supabase Dashboard (project sedsjjmjnikppfaecaya)
--   -> SQL Editor -> New query -> paste this whole file -> Run
-- Requires 0001_page_content_and_media_bucket.sql to have been run first.
--
-- Adds empty 'contact' and 'site' rows to mejasan_page_content — the
-- Contact page and Footer fall back to today's real copy until an admin
-- edits them in Admin -> Pages -> Contact / Site — Footer & Global.
-- Safe to re-run.
-- ============================================================

insert into mejasan_page_content (page_slug, content) values
  ('contact', '{}'),
  ('site', '{}')
on conflict (page_slug) do nothing;
