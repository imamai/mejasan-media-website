-- Seed the default "Mejasan Media sign-off" name/title used to approve every
-- wedding contract, so admins don't have to retype it on every submission
-- (mirrors company_rep_signature_url / company_witness_signature_url from
-- migration 0010). Editable from /admin -> Settings; per-submission values
-- still take precedence if explicitly set.
-- Safe to re-run.

insert into mejasan_settings (key, value, description) values
  ('company_signoff_name',  'Mejasan Media Production', 'Default "approved by" name stamped on every wedding contract at finalize'),
  ('company_signoff_title', 'CEO',                       'Default "approved by" title stamped on every wedding contract at finalize')
on conflict (key) do nothing;
