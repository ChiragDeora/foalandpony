# Cursor Agent Plan — Foal & Pony Ecommerce

Copy everything below the line into a new Cursor Agent chat as the task prompt.

---

## Mission

Finish **Foal & Pony** headless ecommerce: India D2C kids eyewear, scalable to 10k+ SKUs.  
**Do not use Medusa Cloud** ($29/mo). Use **self-hosted Medusa** (free OSS).

## Architecture

```
Next.js 15 storefront (this repo)
  → Medusa Store API (products, cart, checkout, orders)
  → Medusa Admin at /app (catalog CMS — bulk CSV import)
  → Clerk (customer sign-in on website)
  → Supabase (Postgres for Medusa + user_profiles/reviews tables)
  → Brevo (transactional email)
  → Razorpay (India payments — Phase 2)
```

Read first: [AUTH.md](AUTH.md), [ECOMMERCE.md](ECOMMERCE.md).

## Current state (already in repo)

| Done | Item |
|------|------|
| ✅ | Marketing homepage `app/page.tsx` |
| ✅ | Store routes: `/shop`, `/shop/[handle]`, `/cart`, `/checkout`, `/order/[id]`, `/account` |
| ✅ | Shop nav/header/footer `components/shop/*`, styles `app/store.css` |
| ✅ | Medusa JS SDK data layer `lib/data/*`, `lib/config.ts` |
| ✅ | `medusa/` — Medusa v2 starter (backend + admin) |
| ✅ | Clerk middleware + sign-in/up + customer sync API |
| ✅ | Supabase migration `supabase/migrations/20240529000000_user_profiles.sql` |
| ✅ | `docker-compose.yml` (local Postgres + Redis) |
| ✅ | `scripts/sample-catalog.csv` template |

| Not done | Item |
|----------|------|
| ❌ | `medusa/.env` — **missing**; backend not running |
| ❌ | `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` empty — shop shows warning banner |
| ❌ | Razorpay payment in Medusa + checkout |
| ❌ | Brevo order emails (subscriber stub) |
| ❌ | `scripts/import-catalog.ts` (CSV bulk import) |
| ❌ | Fix user `.env` mistakes (see below) |
| ❌ | Prescription flow (later phase) |

## Critical env fixes (do first)

User has root `.env` with errors — fix without committing secrets:

1. **Rename or duplicate** to `.env.local` for Next.js (preferred).
2. **`SUPABASE_SERVICE_ROLE_KEY`** must be the **service_role JWT** from Supabase Dashboard → Settings → API — **not** a Postgres URL.
3. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** must be the **anon public** key (`eyJ...`) — not `sb_publishable_...`.
4. **`medusa/.env`** — create from `medusa/.env.template`:
   - `DATABASE_URL` = Supabase **pooler** URI (port **6543**) OR `postgres://postgres:postgres@localhost:5432/medusa-v2` if using `npm run db:up`
   - `REDIS_URL=redis://localhost:6379`
   - `STORE_CORS=http://localhost:3000`
5. **Never commit** `.env` / `.env.local` with real keys.

Medusa API keys (after `yarn dev` in `medusa/`):

- Admin: http://localhost:9000/app
- **Publishable** (`pk_...`) → `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` — Settings → Publishable API Keys
- **Secret** (`sk_...`) → `MEDUSA_SECRET_API_KEY` — Settings → Secret API Keys

---

## Phase 1 — Make the shop work locally (priority)

**Goal:** `/shop` shows seeded products; add to cart works.

### Steps

```bash
# Terminal 1 — DB (choose ONE)
npm run db:up                                    # local Docker Postgres
# OR use Supabase DATABASE_URL in medusa/.env

# Terminal 2 — Medusa
cd medusa
cp .env.template .env   # then edit DATABASE_URL
yarn install
yarn medusa db:migrate
yarn seed
yarn dev
# → http://localhost:9000/app

# Terminal 3 — Storefront
cp .env.example .env.local   # fill MEDUSA keys
npm run dev
# → http://localhost:3000/shop
```

### Agent tasks

1. Create `medusa/.env` with correct `DATABASE_URL` (document which option: Docker vs Supabase).
2. Verify migrate + seed succeed; troubleshoot connection errors.
3. Document admin login: `yarn medusa user -e raghav@spco.in -p <password>` (Medusa Admin at http://localhost:9000/app).
4. Ensure publishable key is linked to default sales channel in Admin.
5. Copy `pk_` into `.env.local`; confirm shop banner disappears and products render.
6. Test: browse `/shop` → product page → add to cart → `/cart`.

### Acceptance criteria

- [ ] http://localhost:9000/health or store products API returns data
- [ ] `/shop` grid shows products with images/prices
- [ ] Cart count updates in header
- [ ] `npm run build` passes

---

## Phase 2 — Payments & email

**Goal:** Checkout completes with Razorpay; order confirmation email via Brevo.

### Agent tasks

1. Add Razorpay payment provider to Medusa (plugin or custom provider module in `medusa/src/modules/`).
2. Wire `app/(store)/checkout` to Medusa payment session + Razorpay modal (UPI/cards).
3. Webhook route for `payment.captured` → mark order paid.
4. Implement `medusa/src/subscribers/order-placed-brevo.ts` (or Next API route) using Brevo API.
5. GST-inclusive pricing copy on checkout; link policy pages in footer.

### Acceptance criteria

- [ ] Test payment in Razorpay test mode
- [ ] Order appears in Medusa Admin
- [ ] Customer receives Brevo confirmation email

---

## Phase 3 — Catalog at scale

**Goal:** Bulk import path for 10k SKUs.

### Agent tasks

1. Implement `scripts/import-catalog.ts` — read CSV, Medusa Admin API batch create products/variants.
2. Document image bulk upload to Supabase Storage or R2; CSV `image_url` column.
3. Optional: Meilisearch when catalog > 500 SKUs.

### CSV columns

`product_handle,title,description,collection,variant_sku,option_color,option_age,price_inr,inventory,image_url`

Reference: `scripts/sample-catalog.csv`

---

## Phase 4 — Polish & deploy

1. Clerk keys → sign-in + `/account` order history (Medusa customer orders).
2. Run Supabase migration for `user_profiles` + `reviews`; wire homepage review form.
3. Deploy: Vercel (Next.js), Railway/Render (Medusa), Supabase (Postgres), Upstash (Redis).
4. Production env vars on each platform; CORS update for production domains.

---

## Key files map

| Path | Purpose |
|------|---------|
| `app/(store)/shop/page.tsx` | Product listing |
| `app/(store)/shop/[handle]/page.tsx` | PDP |
| `app/(store)/cart/page.tsx` | Cart |
| `app/(store)/checkout/page.tsx` | Checkout |
| `lib/data/cart.ts` | Cart server actions |
| `lib/data/products.ts` | Product fetch |
| `medusa/medusa-config.ts` | Medusa config |
| `medusa/src/scripts/seed.ts` | Demo products + publishable key |
| `components/shop/ShopHeader.tsx` | Store navigation |
| `app/store.css` | Shop styles (must stay imported in `app/layout.tsx`) |

## Constraints for the agent

- **Minimize scope** per phase; don’t refactor marketing homepage unless needed.
- **Do not** rebuild catalog in Supabase tables — Medusa owns commerce.
- **Do not** subscribe to Medusa Cloud.
- **Do not** commit secrets or force-push.
- Match existing code style (TypeScript, App Router, server actions).
- Run `npm run build` after storefront changes.

## If blocked

| Problem | Action |
|---------|--------|
| Admin won’t open | Medusa not running — check `medusa/.env` + `yarn dev` logs |
| No products on shop | Run `yarn seed`; check publishable key linked to sales channel |
| Styles broken | Ensure `app/store.css` imported in `app/layout.tsx`; restart dev server |
| Region errors | Seed creates India region; `NEXT_PUBLIC_DEFAULT_REGION=in` |

---

## Suggested first message to agent

```
Execute AGENT_PLAN.md Phase 1 only:
1. Fix .env.local template values (document fixes, don’t commit secrets)
2. Create medusa/.env and start Medusa with Docker Postgres
3. Migrate, seed, get publishable API key into .env.local
4. Verify /shop shows products end-to-end
```
