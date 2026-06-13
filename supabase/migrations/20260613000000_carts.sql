create table if not exists public.carts (
  clerk_user_id text primary key,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.carts enable row level security;
-- No select/insert policies: only the service-role admin client (server-side,
-- bypasses RLS) reads or writes this table — matches the orders/order_items pattern.
