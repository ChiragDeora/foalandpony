# Deploy Foal & Pony (company access, not localhost)

Your stack has **3 public URLs** when live:

| What | Example URL | Who uses it |
|------|-------------|-------------|
| **Website + shop** | `https://foalandpony.com` or `https://shop.foalandpony.com` | Customers & company |
| **Medusa API** | `https://api.foalandpony.com` | Storefront (hidden from users) |
| **Medusa Admin** | `https://api.foalandpony.com/app` | Your team (catalog, orders) |

Localhost is only for development. Production uses the hosts above.

---

## Architecture (production)

```
                    ┌─────────────────┐
   Users / team ──► │  Vercel         │  Next.js (marketing + /shop)
                    │  foalandpony.com│
                    └────────┬────────┘
                             │ Store API + publishable key
                    ┌────────▼────────┐
                    │  Railway/Render │  Medusa backend + Admin
                    │  api.foalandpony  │
                    └────────┬────────┘
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        Supabase PG    Upstash Redis   R2/S3 images
        (you have)     (free tier)     (optional)
```

---

## Prerequisites

- [ ] GitHub repo pushed (private or public)
- [ ] Domain (e.g. `foalandpony.com`) — DNS access at your registrar
- [ ] Supabase project (already set up)
- [ ] Medusa seeded (products, publishable key, admin user)

---

## Step 1 — Database & Redis (keep Supabase, add Upstash)

### Postgres (Supabase)

You already use Supabase. For production Medusa:

1. Supabase → **Project Settings → Database**
2. Copy **Connection string → URI** (use **Transaction pooler**, port **6543**)
3. This becomes `DATABASE_URL` on the Medusa host (not in the Next.js app)

### Redis (Upstash — free)

Medusa needs Redis in production (not the fake in-memory one).

1. Create account at [upstash.com](https://upstash.com) → **Redis** → create database
2. Copy `REDIS_URL` (starts with `rediss://` or `redis://`)

---

## Step 2 — Deploy Medusa backend (Railway recommended)

### Railway

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select `foalandpony` repo
3. **Root directory:** `medusa`
4. **Build command:** `yarn install && yarn build`
5. **Start command:** `yarn start` (or `medusa start`)
6. Add **environment variables:**

```bash
NODE_ENV=production
DATABASE_URL=postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379
JWT_SECRET=<long-random-string>
COOKIE_SECRET=<long-random-string>
STORE_CORS=https://foalandpony.com,https://www.foalandpony.com
ADMIN_CORS=https://api.foalandpony.com
AUTH_CORS=https://foalandpony.com,https://api.foalandpony.com
```

7. Deploy → Railway gives a URL like `https://foalandpony-production.up.railway.app`
8. **Custom domain:** Settings → Networking → add `api.foalandpony.com` → CNAME to Railway

### First deploy on Railway

Run migrations once (Railway **one-off command** or local against prod DB):

```bash
cd medusa
DATABASE_URL="your-supabase-pooler-url" yarn medusa db:migrate
DATABASE_URL="your-supabase-pooler-url" yarn seed   # only if empty DB
```

### Admin access for company

- URL: `https://api.foalandpony.com/app`
- Login: `raghav@spco.in` + your password
- **Publishable key:** Admin → Settings → Publishable API Keys → copy `pk_...` for Vercel

---

## Step 3 — Deploy storefront (Vercel)

1. [vercel.com](https://vercel.com) → **Add New Project** → import GitHub `foalandpony`
2. **Root directory:** `.` (repo root, not `medusa`)
3. Framework: **Next.js** (auto-detected)
4. **Environment variables** (Production):

```bash
MEDUSA_BACKEND_URL=https://api.foalandpony.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxx
NEXT_PUBLIC_DEFAULT_REGION=in

# Clerk (production instance)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/account
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/account

# Supabase (fix keys — use Dashboard → API, not Postgres URL)
NEXT_PUBLIC_SUPABASE_URL=https://afmmqcmfmwimkkykxrby.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...anon...
SUPABASE_SERVICE_ROLE_KEY=eyJ...service_role...

BREVO_API_KEY=
BREVO_SENDER_EMAIL=raghav@spco.in
```

5. Deploy → you get `https://foalandpony.vercel.app`
6. **Domain:** Vercel → Project → Domains → add `foalandpony.com` and `www.foalandpony.com`

### Clerk production

In [Clerk Dashboard](https://dashboard.clerk.com):

- Add allowed origins: `https://foalandpony.com`
- Add redirect URLs for sign-in/sign-up

---

## Step 4 — DNS (so the company has one link)

At your domain registrar (GoDaddy, Cloudflare, etc.):

| Type | Name | Value |
|------|------|--------|
| CNAME | `@` or `www` | Vercel (they give exact target) |
| CNAME | `api` | Railway host |

**Share with company:**

- **Shop / website:** `https://foalandpony.com/shop`
- **Admin (internal):** `https://api.foalandpony.com/app`

---

## Step 5 — Checklist before sharing

- [ ] `https://foalandpony.com/shop` loads products (no yellow “backend not connected” banner)
- [ ] `https://api.foalandpony.com/health` returns OK
- [ ] Admin login works on production URL
- [ ] `STORE_CORS` includes your real shop domain (no typos)
- [ ] Secrets are only in Vercel/Railway dashboards — **not** committed to Git
- [ ] `.env` / `.env.local` stay local; use host env UIs for production

---

## Free-tier cost summary

| Service | Cost |
|---------|------|
| Vercel | Free for hobby / small traffic |
| Railway | ~$5 credit/month, then usage |
| Supabase | Free tier |
| Upstash Redis | Free tier |
| Clerk | Free tier (10k MAU) |
| Domain | ~₹500–1000/year |

**Not required:** Medusa Cloud ($29/mo) — you self-host on Railway.

---

## Alternatives

| Host | Medusa | Next.js |
|------|--------|---------|
| **Railway** + **Vercel** | Easy, recommended | Easy |
| **Render** + **Vercel** | Free tier, sleeps on idle | Easy |
| **Fly.io** | Good for always-on | Vercel |

---

## Common issues

| Problem | Fix |
|---------|-----|
| Shop empty / banner on live site | Wrong `MEDUSA_BACKEND_URL` or missing `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` on Vercel |
| CORS error in browser | Add exact `https://foalandpony.com` to `STORE_CORS` on Medusa, redeploy |
| Admin login fails on prod | Run password reset script against prod DB, or use reset flow on prod Admin URL |
| Medusa crashes | Set `REDIS_URL` (Upstash) — required for production |

---

## Quick share message for your team

> **Shop:** https://foalandpony.com/shop  
> **Admin (orders/products):** https://api.foalandpony.com/app  
> Login: raghav@spco.in (password shared separately)

Replace domains with your real ones after DNS is connected.
