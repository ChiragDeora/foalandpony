create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text,
  email text not null,
  phone text not null,
  shipping_address jsonb not null,
  total_amount integer not null,
  status text not null default 'pending_payment',
  created_at timestamptz not null default now()
);
create index if not exists orders_clerk_user_id_idx on public.orders (clerk_user_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text not null,
  product_name text not null,
  colour_name text,
  quantity integer not null check (quantity > 0),
  unit_price integer not null,
  created_at timestamptz not null default now()
);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
-- No select/insert policies: only the service-role admin client (server-side,
-- bypasses RLS) reads or writes these tables — matches the user_profiles pattern.
