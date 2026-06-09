-- Links Clerk users to Medusa customers and optional app data.
-- Commerce catalog/orders stay in Medusa; this is the auth bridge + extras.

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  email text not null,
  medusa_customer_id text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_profiles_email_idx on public.user_profiles (email);
create index if not exists user_profiles_medusa_customer_id_idx on public.user_profiles (medusa_customer_id);

-- Homepage / product reviews (not stored in Medusa)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text,
  author_name text not null,
  author_email text,
  rating int not null check (rating >= 1 and rating <= 5),
  body text not null,
  product_handle text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
alter table public.reviews enable row level security;

-- user_profiles: only server (SUPABASE_SERVICE_ROLE_KEY) reads/writes.
-- Optional later: map Clerk JWT in Supabase for direct client access.

-- Public can read approved reviews only
create policy "Public read approved reviews"
  on public.reviews for select
  using (approved = true);
