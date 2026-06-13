drop index if exists public.user_profiles_medusa_customer_id_idx;
alter table public.user_profiles drop column if exists medusa_customer_id;
