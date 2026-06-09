# Auth & data: Clerk + Supabase + Medusa

Three services, **one job each** — do not duplicate commerce tables in Supabase.

```mermaid
flowchart LR
  subgraph storefront [Next.js]
    ClerkUI[Clerk sign-in]
    Pages[Shop pages]
  end

  subgraph auth [Clerk]
    Users[Customer identity]
  end

  subgraph data [Supabase]
    PG[(Postgres)]
    Profiles[user_profiles]
    Reviews[reviews]
    Storage[Storage optional]
  end

  subgraph commerce [Medusa]
    Catalog[Products SKUs]
    Orders[Orders cart]
    Admin[Admin CMS]
  end

  ClerkUI --> Users
  Users -->|sync API| Profiles
  Profiles --> PG
  Pages -->|Store API| commerce
  Admin --> PG
  commerce --> PG
  ClerkUI --> Pages
```

## Who does what

| Service | Role |
|---------|------|
| **Clerk** | Customer login on the website (sign up, sign in, session). **Not** for Medusa Admin. |
| **Supabase** | **Postgres host** for Medusa (`DATABASE_URL` in `medusa/.env`). Plus app tables: `user_profiles`, `reviews`. Optional **Storage** for bulk product images. |
| **Medusa** | Products, variants, cart, checkout, orders, inventory, merchant admin (`/app`). |

## Customer sign-in flow

1. User signs in with **Clerk** (`/sign-in`).
2. Visiting `/account` triggers `POST /api/customer/sync`.
3. Server upserts **Supabase** `user_profiles` (`clerk_user_id` ↔ `medusa_customer_id`).
4. Server creates a **Medusa customer** (Admin API) if missing.
5. Orders at checkout still go through **Medusa**; link orders to `medusa_customer_id` when logged in.

## Setup

### Clerk

1. [clerk.com](https://clerk.com) → new application.
2. Copy keys into `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Allow redirect URLs: `http://localhost:3000/*`

### Supabase

1. New project at [supabase.com](https://supabase.com).
2. Run migration: `supabase/migrations/20240529000000_user_profiles.sql` (SQL editor or CLI).
3. Copy into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only, never expose to browser)

### Medusa on Supabase Postgres

In `medusa/.env`:

```bash
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

Use the **connection pooler** (port **6543**) for serverless/Railway. Then:

```bash
cd medusa && yarn medusa db:migrate && yarn seed && yarn dev
```

Create a **Secret API Key** in Medusa Admin → Settings → Secret API Keys → set `MEDUSA_SECRET_API_KEY` in storefront `.env.local` for customer sync.

## What not to do

- Do **not** store products/orders/carts in Supabase — Medusa owns commerce.
- Do **not** use Clerk for **merchant** admin — use Medusa Admin (`http://localhost:9000/app`).
- Do **not** put `SUPABASE_SERVICE_ROLE_KEY` in client code.

## Free tiers

| Service | Free tier |
|---------|-----------|
| Clerk | 10k MAU |
| Supabase | Postgres + 1GB storage |
| Medusa | Open source (you host) |
