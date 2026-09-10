-- Tracks when a draft (unsigned, review-only) copy of the contract was last
-- emailed to the client during back-and-forth revisions, distinct from
-- reviewed_at/signed_contract_pdf_url which only get set by the actual
-- finalize action. Purely informational for the admin.

alter table mejasan_wedding_intake
  add column if not exists last_draft_sent_at timestamptz;
