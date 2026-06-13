alter table public.user_profiles
  add column if not exists phone text,
  add column if not exists shipping_address jsonb;
