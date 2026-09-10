-- Seed two singleton settings rows holding the reusable Company Rep and
-- Witness (Company) signature image URLs, uploaded once by an admin from
-- /admin -> Settings, and auto-applied to every wedding contract at
-- finalize time instead of being drawn per-submission (they're almost
-- always blank on the public client form in practice).
-- Requires the base schema's mejasan_settings table to already exist.
-- Safe to re-run.

insert into mejasan_settings (key, value, description) values
  ('company_rep_signature_url',     null, 'Reusable Company Rep signature image, auto-stamped onto wedding contracts on finalize'),
  ('company_witness_signature_url', null, 'Reusable Witness (Company) signature image, auto-stamped onto wedding contracts on finalize')
on conflict (key) do nothing;
