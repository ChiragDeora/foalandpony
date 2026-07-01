-- Shape Spotter (vision screening) opt-in leads.
--
-- Stores ONLY the aggregate screening result and the parent's own opt-in
-- contact. No child name/age is captured here — the client never sends it, so
-- no child field is ever linked to the parent's contact (India DPDP-conscious).

create table if not exists public.quiz_leads (
  id uuid primary key default gen_random_uuid(),
  symptom_score integer not null check (symptom_score between 0 and 8),
  right_eye_level integer not null check (right_eye_level between 0 and 5),
  left_eye_level integer not null check (left_eye_level between 0 and 5),
  asymmetry_flag boolean not null default false,
  result_tier text not null check (result_tier in ('GREEN', 'YELLOW', 'RED')),
  parent_name text,
  parent_contact text not null,
  created_at timestamptz not null default now()
);
create index if not exists quiz_leads_created_at_idx on public.quiz_leads (created_at desc);

alter table public.quiz_leads enable row level security;
-- No select/insert policies: only the service-role admin client (server-side,
-- bypasses RLS) writes here, matching the orders/carts pattern.
