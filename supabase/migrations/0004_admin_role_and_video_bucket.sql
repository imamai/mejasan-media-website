-- ============================================================
-- Migration: real admin-role provisioning + video support on mejasan-media
-- Run this once in: Supabase Dashboard (project sedsjjmjnikppfaecaya)
--   -> SQL Editor -> New query -> paste this whole file -> Run
-- Safe to re-run: every statement is idempotent.
--
-- Why: the admin login gate (client-side + middleware) lets in anyone with
-- an @mejasanmedia.com email, but every write in the app is actually gated
-- by mejasan_is_admin(auth.uid()), which checks mejasan_roles / app_metadata
-- — neither of which any code ever populated. That mismatch made every
-- admin write (portfolio, blog, gallery uploads, and now projects) silently
-- fail RLS unless someone manually flipped a flag in the Supabase dashboard.
-- This migration makes the DB-side check match the app-side check for real,
-- and keeps matching it automatically for any future @mejasanmedia.com signup.
-- ============================================================

-- ── Backfill: grant admin role to any existing @mejasanmedia.com user ──
insert into mejasan_roles (user_id, role)
select id, 'admin' from auth.users
where email ilike '%@mejasanmedia.com'
on conflict (user_id) do nothing;

-- ── Keep it true going forward: auto-grant admin role on signup ──
create or replace function mejasan_sync_admin_role()
returns trigger language plpgsql security definer as $$
begin
  if new.email ilike '%@mejasanmedia.com' then
    insert into mejasan_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_mejasan_sync_admin_role on auth.users;
create trigger trg_mejasan_sync_admin_role
  after insert on auth.users
  for each row execute procedure mejasan_sync_admin_role();

-- ── Allow project video deliverables through the existing mejasan-media bucket ──
update storage.buckets
set file_size_limit = 524288000, -- 500MB
    allowed_mime_types = array[
      'image/jpeg','image/png','image/webp','image/gif',
      'video/mp4','video/quicktime','video/webm'
    ]
where id = 'mejasan-media';
