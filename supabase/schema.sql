-- ============================================================
-- Mejasan Media Production — Supabase Schema
-- Project: edos_website | Prefix: mejasan_
-- ============================================================

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- ROLES & CLIENT PROFILES
-- ============================================================

create table if not exists mejasan_roles (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  role        text not null check (role in ('admin','client','staff')),
  created_at  timestamptz not null default now(),
  unique(user_id)
);

create table if not exists mejasan_client_profiles (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null unique,
  full_name       text,
  phone           text,
  company         text,
  avatar_url      text,
  preferred_contact text default 'email',
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- CONTACT SUBMISSIONS & LEADS
-- ============================================================

create table if not exists mejasan_contact_submissions (
  id          uuid primary key default uuid_generate_v4(),
  type        text not null default 'contact' check (type in ('contact','booking','quote')),
  name        text not null,
  email       text not null,
  phone       text,
  company     text,
  service     text,
  event_date  date,
  message     text,
  budget      text,
  status      text not null default 'new' check (status in ('new','read','replied','archived')),
  assigned_to uuid references auth.users(id),
  metadata    jsonb default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- BOOKINGS
-- ============================================================

create table if not exists mejasan_bookings (
  id              uuid primary key default uuid_generate_v4(),
  reference       text not null unique,
  client_user_id  uuid references auth.users(id),
  client_name     text not null,
  client_email    text not null,
  client_phone    text,
  service         text not null,
  event_date      date not null,
  event_type      text,
  event_location  text,
  duration        text,
  budget          text,
  notes           text,
  status          text not null default 'pending' check (status in ('pending','confirmed','in_progress','completed','cancelled')),
  deposit_paid    boolean not null default false,
  total_amount    numeric(10,2),
  deposit_amount  numeric(10,2),
  metadata        jsonb default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- PROJECTS
-- ============================================================

create table if not exists mejasan_projects (
  id              uuid primary key default uuid_generate_v4(),
  booking_id      uuid references mejasan_bookings(id),
  client_user_id  uuid references auth.users(id),
  title           text not null,
  description     text,
  service         text not null,
  stage           int not null default 0 check (stage between 0 and 5),
  stage_label     text,
  start_date      date,
  delivery_date   date,
  status          text not null default 'active' check (status in ('active','on_hold','completed','archived')),
  cover_image     text,
  metadata        jsonb default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- PROJECT FILES
-- ============================================================

create table if not exists mejasan_project_files (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid references mejasan_projects(id) on delete cascade not null,
  name        text not null,
  url         text not null,
  type        text not null default 'document',
  size_bytes  bigint,
  uploaded_by uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- GALLERIES
-- ============================================================

create table if not exists mejasan_galleries (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid references mejasan_projects(id),
  client_user_id  uuid references auth.users(id) not null,
  title           text not null,
  description     text,
  is_shared       boolean not null default false,
  share_token     text unique,
  password_hash   text,
  expires_at      timestamptz,
  cover_image     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists mejasan_gallery_images (
  id          uuid primary key default uuid_generate_v4(),
  gallery_id  uuid references mejasan_galleries(id) on delete cascade not null,
  url         text not null,
  thumbnail   text,
  caption     text,
  width       int,
  height      int,
  size_bytes  bigint,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- PORTFOLIO (PUBLIC)
-- ============================================================

create table if not exists mejasan_portfolio (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,
  title         text not null,
  category      text not null,
  description   text,
  client_name   text,
  cover_image   text,
  images        jsonb default '[]',
  video_url     text,
  tags          text[] default '{}',
  is_published  boolean not null default false,
  is_featured   boolean not null default false,
  sort_order    int not null default 0,
  view_count    int not null default 0,
  metadata      jsonb default '{}',
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- BLOG
-- ============================================================

create table if not exists mejasan_blog_posts (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  content       text,
  cover_image   text,
  category      text not null default 'Behind the Lens',
  tags          text[] default '{}',
  author_id     uuid references auth.users(id),
  author_name   text not null default 'Mejasan Team',
  is_published  boolean not null default false,
  is_featured   boolean not null default false,
  read_time     int not null default 5,
  view_count    int not null default 0,
  seo_title     text,
  seo_desc      text,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================

create table if not exists mejasan_testimonials (
  id            uuid primary key default uuid_generate_v4(),
  client_name   text not null,
  client_role   text,
  client_avatar text,
  content       text not null,
  rating        int not null default 5 check (rating between 1 and 5),
  service       text,
  project_id    uuid references mejasan_projects(id),
  is_published  boolean not null default false,
  is_featured   boolean not null default false,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- INVOICES & CONTRACTS
-- ============================================================

create table if not exists mejasan_invoices (
  id              uuid primary key default uuid_generate_v4(),
  invoice_number  text not null unique,
  booking_id      uuid references mejasan_bookings(id),
  project_id      uuid references mejasan_projects(id),
  client_user_id  uuid references auth.users(id) not null,
  client_name     text not null,
  client_email    text not null,
  line_items      jsonb not null default '[]',
  subtotal        numeric(10,2) not null default 0,
  tax_rate        numeric(5,2) not null default 0,
  tax_amount      numeric(10,2) not null default 0,
  total_amount    numeric(10,2) not null default 0,
  amount_paid     numeric(10,2) not null default 0,
  currency        text not null default 'KES',
  status          text not null default 'draft' check (status in ('draft','sent','viewed','paid','overdue','cancelled')),
  due_date        date,
  paid_at         timestamptz,
  notes           text,
  pdf_url         text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists mejasan_contracts (
  id              uuid primary key default uuid_generate_v4(),
  booking_id      uuid references mejasan_bookings(id),
  project_id      uuid references mejasan_projects(id),
  client_user_id  uuid references auth.users(id) not null,
  title           text not null,
  content         text,
  status          text not null default 'pending' check (status in ('pending','signed','expired')),
  signed_at       timestamptz,
  signature_data  text,
  pdf_url         text,
  expires_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- MESSAGES
-- ============================================================

create table if not exists mejasan_messages (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid references mejasan_projects(id) on delete cascade,
  sender_id   uuid references auth.users(id) not null,
  sender_name text not null,
  is_admin    boolean not null default false,
  content     text not null,
  read_at     timestamptz,
  attachments jsonb default '[]',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

create table if not exists mejasan_notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  type        text not null,
  title       text not null,
  body        text,
  is_read     boolean not null default false,
  link        text,
  metadata    jsonb default '{}',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- ACTIVITY LOGS
-- ============================================================

create table if not exists mejasan_activity_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id),
  action      text not null,
  entity_type text,
  entity_id   uuid,
  details     jsonb default '{}',
  ip_address  text,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- SETTINGS
-- ============================================================

create table if not exists mejasan_settings (
  id          uuid primary key default uuid_generate_v4(),
  key         text not null unique,
  value       text,
  value_json  jsonb,
  description text,
  updated_by  uuid references auth.users(id),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_mejasan_bookings_status      on mejasan_bookings(status);
create index if not exists idx_mejasan_bookings_email       on mejasan_bookings(client_email);
create index if not exists idx_mejasan_bookings_event_date  on mejasan_bookings(event_date);
create index if not exists idx_mejasan_projects_client      on mejasan_projects(client_user_id);
create index if not exists idx_mejasan_projects_status      on mejasan_projects(status);
create index if not exists idx_mejasan_portfolio_published  on mejasan_portfolio(is_published, sort_order);
create index if not exists idx_mejasan_portfolio_category   on mejasan_portfolio(category);
create index if not exists idx_mejasan_blog_published       on mejasan_blog_posts(is_published, published_at desc);
create index if not exists idx_mejasan_gallery_client       on mejasan_galleries(client_user_id);
create index if not exists idx_mejasan_gallery_images_gid   on mejasan_gallery_images(gallery_id, sort_order);
create index if not exists idx_mejasan_messages_project     on mejasan_messages(project_id, created_at);
create index if not exists idx_mejasan_notifications_user   on mejasan_notifications(user_id, is_read, created_at desc);
create index if not exists idx_mejasan_invoices_client      on mejasan_invoices(client_user_id, status);
create index if not exists idx_mejasan_contact_status       on mejasan_contact_submissions(status, created_at desc);
create index if not exists idx_mejasan_activity_user        on mejasan_activity_logs(user_id, created_at desc);

-- Full-text search on portfolio
create index if not exists idx_mejasan_portfolio_fts on mejasan_portfolio using gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')));
create index if not exists idx_mejasan_blog_fts on mejasan_blog_posts using gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,'')));

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

create or replace function mejasan_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply trigger to all tables with updated_at
do $$
declare
  t text;
begin
  foreach t in array array[
    'mejasan_client_profiles',
    'mejasan_contact_submissions',
    'mejasan_bookings',
    'mejasan_projects',
    'mejasan_galleries',
    'mejasan_portfolio',
    'mejasan_blog_posts',
    'mejasan_invoices',
    'mejasan_contracts'
  ] loop
    execute format('
      drop trigger if exists trg_%s_updated_at on %s;
      create trigger trg_%s_updated_at
        before update on %s
        for each row execute procedure mejasan_set_updated_at();
    ', t, t, t, t);
  end loop;
end;
$$;

-- Auto-generate invoice numbers
create or replace function mejasan_generate_invoice_number()
returns trigger language plpgsql as $$
begin
  if new.invoice_number is null or new.invoice_number = '' then
    new.invoice_number := 'MJI-' || to_char(now(), 'YYYYMM') || '-' || lpad(nextval('mejasan_invoice_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create sequence if not exists mejasan_invoice_seq start 1001;

drop trigger if exists trg_mejasan_invoices_number on mejasan_invoices;
create trigger trg_mejasan_invoices_number
  before insert on mejasan_invoices
  for each row execute procedure mejasan_generate_invoice_number();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table mejasan_roles               enable row level security;
alter table mejasan_client_profiles     enable row level security;
alter table mejasan_contact_submissions enable row level security;
alter table mejasan_bookings            enable row level security;
alter table mejasan_projects            enable row level security;
alter table mejasan_project_files       enable row level security;
alter table mejasan_galleries           enable row level security;
alter table mejasan_gallery_images      enable row level security;
alter table mejasan_portfolio           enable row level security;
alter table mejasan_blog_posts          enable row level security;
alter table mejasan_testimonials        enable row level security;
alter table mejasan_invoices            enable row level security;
alter table mejasan_contracts           enable row level security;
alter table mejasan_messages            enable row level security;
alter table mejasan_notifications       enable row level security;
alter table mejasan_activity_logs       enable row level security;
alter table mejasan_settings            enable row level security;

-- Helper: is admin
create or replace function mejasan_is_admin(uid uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from mejasan_roles where user_id = uid and role = 'admin'
  ) or (
    select coalesce(raw_app_meta_data->>'role','') = 'admin'
    from auth.users where id = uid
  );
$$;

-- ---- mejasan_roles ----
create policy "Admins manage roles" on mejasan_roles for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- ---- mejasan_client_profiles ----
create policy "Users manage own profile" on mejasan_client_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins manage all profiles" on mejasan_client_profiles for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- ---- mejasan_contact_submissions ----
create policy "Anyone can submit contact" on mejasan_contact_submissions for insert
  with check (true);

create policy "Admins manage contact submissions" on mejasan_contact_submissions for all
  using (mejasan_is_admin(auth.uid()));

-- ---- mejasan_bookings ----
create policy "Clients view own bookings" on mejasan_bookings for select
  using (auth.uid() = client_user_id);

create policy "Admins manage all bookings" on mejasan_bookings for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

create policy "Anyone can insert booking" on mejasan_bookings for insert
  with check (true);

-- ---- mejasan_projects ----
create policy "Clients view own projects" on mejasan_projects for select
  using (auth.uid() = client_user_id);

create policy "Admins manage all projects" on mejasan_projects for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- ---- mejasan_project_files ----
create policy "Clients view own project files" on mejasan_project_files for select
  using (exists (
    select 1 from mejasan_projects p
    where p.id = project_id and p.client_user_id = auth.uid()
  ));

create policy "Admins manage project files" on mejasan_project_files for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- ---- mejasan_galleries ----
create policy "Clients view own galleries" on mejasan_galleries for select
  using (auth.uid() = client_user_id);

create policy "Admins manage galleries" on mejasan_galleries for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- ---- mejasan_gallery_images ----
create policy "Clients view images in own galleries" on mejasan_gallery_images for select
  using (exists (
    select 1 from mejasan_galleries g
    where g.id = gallery_id and g.client_user_id = auth.uid()
  ));

create policy "Admins manage gallery images" on mejasan_gallery_images for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- ---- mejasan_portfolio (public read) ----
create policy "Public view published portfolio" on mejasan_portfolio for select
  using (is_published = true);

create policy "Admins manage portfolio" on mejasan_portfolio for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- ---- mejasan_blog_posts (public read) ----
create policy "Public view published posts" on mejasan_blog_posts for select
  using (is_published = true);

create policy "Admins manage blog" on mejasan_blog_posts for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- ---- mejasan_testimonials (public read) ----
create policy "Public view published testimonials" on mejasan_testimonials for select
  using (is_published = true);

create policy "Admins manage testimonials" on mejasan_testimonials for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- ---- mejasan_invoices ----
create policy "Clients view own invoices" on mejasan_invoices for select
  using (auth.uid() = client_user_id);

create policy "Admins manage invoices" on mejasan_invoices for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- ---- mejasan_contracts ----
create policy "Clients view own contracts" on mejasan_contracts for select
  using (auth.uid() = client_user_id);

create policy "Clients sign contracts" on mejasan_contracts for update
  using (auth.uid() = client_user_id)
  with check (auth.uid() = client_user_id);

create policy "Admins manage contracts" on mejasan_contracts for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- ---- mejasan_messages ----
create policy "Project participants view messages" on mejasan_messages for select
  using (
    auth.uid() = sender_id
    or mejasan_is_admin(auth.uid())
    or exists (
      select 1 from mejasan_projects p
      where p.id = project_id and p.client_user_id = auth.uid()
    )
  );

create policy "Authenticated users send messages" on mejasan_messages for insert
  with check (auth.uid() = sender_id);

-- ---- mejasan_notifications ----
create policy "Users view own notifications" on mejasan_notifications for select
  using (auth.uid() = user_id);

create policy "Users update own notifications" on mejasan_notifications for update
  using (auth.uid() = user_id);

create policy "Admins manage notifications" on mejasan_notifications for all
  using (mejasan_is_admin(auth.uid()));

-- ---- mejasan_activity_logs ----
create policy "Users view own activity" on mejasan_activity_logs for select
  using (auth.uid() = user_id);

create policy "Admins view all activity" on mejasan_activity_logs for select
  using (mejasan_is_admin(auth.uid()));

create policy "System can insert activity" on mejasan_activity_logs for insert
  with check (true);

-- ---- mejasan_settings ----
create policy "Admins manage settings" on mejasan_settings for all
  using (mejasan_is_admin(auth.uid()))
  with check (mejasan_is_admin(auth.uid()));

-- ============================================================
-- STORAGE BUCKETS
-- (Run via Supabase Dashboard > Storage or via API)
-- ============================================================

-- Bucket: mejasan-portfolio (public)
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values ('mejasan-portfolio', 'mejasan-portfolio', true, 52428800, array['image/jpeg','image/png','image/webp','image/gif','video/mp4']);

-- Bucket: mejasan-galleries (private)
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values ('mejasan-galleries', 'mejasan-galleries', false, 104857600, array['image/jpeg','image/png','image/webp']);

-- Bucket: mejasan-documents (private)
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values ('mejasan-documents', 'mejasan-documents', false, 52428800, array['application/pdf']);

-- Bucket: mejasan-avatars (public)
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values ('mejasan-avatars', 'mejasan-avatars', true, 5242880, array['image/jpeg','image/png','image/webp']);

-- ============================================================
-- SEED: Default settings
-- ============================================================

insert into mejasan_settings (key, value, description) values
  ('company_name',    'Mejasan Media Production',      'Company display name'),
  ('company_email',   'info@mejasanmedia.com',         'Primary contact email'),
  ('company_phone',   '+254 700 000 000',              'Primary contact phone'),
  ('company_address', 'Nairobi, Kenya',                'Physical address'),
  ('currency',        'KES',                           'Default currency'),
  ('tax_rate',        '16',                            'VAT rate percentage'),
  ('deposit_percent', '50',                            'Booking deposit percentage'),
  ('booking_lead_days','7',                            'Minimum days before booking')
on conflict (key) do nothing;
