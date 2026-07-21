-- ============================================================
-- Migration: Home page content row + seed real testimonials
-- Run this once in: Supabase Dashboard (project sedsjjmjnikppfaecaya)
--   -> SQL Editor -> New query -> paste this whole file -> Run
-- Requires 0001_page_content_and_media_bucket.sql to have been run first.
--
-- 1) Adds the 'home' row to mejasan_page_content (empty content — the
--    site falls back to today's real homepage copy until an admin edits
--    it in Admin -> Pages -> Home).
-- 2) Seeds the 4 existing homepage testimonials as real rows in
--    mejasan_testimonials, ONLY if that table is currently empty — the
--    homepage's testimonials section now reads from this table (via the
--    existing Admin -> Reviews tab) instead of a hardcoded list.
-- Safe to re-run.
-- ============================================================

insert into mejasan_page_content (page_slug, content) values ('home', '{}')
on conflict (page_slug) do nothing;

insert into mejasan_testimonials (client_name, client_role, client_avatar, content, rating, is_published, is_featured, sort_order)
select * from (values
  ('Sarah Kamau', 'Bride, Karen Wedding 2024', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', 'Mejasan captured every moment of our wedding day with such artistry. The photos are beyond anything we imagined — they''re not just pictures, they''re memories that will live forever.', 5, true, true, 1),
  ('James Mwangi', 'Marketing Director, Safaricom PLC', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', 'We hired Mejasan for our annual corporate summit and the results were phenomenal. The team was professional, the quality was world-class, and the deliverable exceeded every expectation.', 5, true, true, 2),
  ('Grace Njoroge', 'Executive Director, UN Environment Programme', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&q=80', 'The drone footage Mejasan produced for our climate summit documentation was absolutely breathtaking. Their KCAA licensing gave us complete confidence throughout the project.', 5, true, true, 3),
  ('Michael Oloo', 'Brand Manager, Equity Bank Kenya', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', 'Outstanding content production team. They understood our brand voice instantly and delivered a social media campaign that drove measurable results. We won''t use anyone else.', 5, true, true, 4)
) as v(client_name, client_role, client_avatar, content, rating, is_published, is_featured, sort_order)
where not exists (select 1 from mejasan_testimonials);
