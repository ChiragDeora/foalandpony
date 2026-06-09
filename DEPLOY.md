# Deploying Foal & Pony

The stack splits across two hosts. Your company team only ever sees one URL.

```
┌──────────────────────────────────────────────────────────────┐
│  foalandpony.com           →  Vercel  →  Next.js storefront  │
│  admin.foalandpony.com     →  Vercel proxy  →  Render Medusa │
└──────────────────────────────────────────────────────────────┘
```

- **Vercel** hosts the public storefront (this Next.js app).
- **Render** runs the Medusa backend that the admin UI lives on.
- **Vercel proxies** `admin.foalandpony.com` to Render via the `next.config.js`
  rewrite, so the company team never sees the `*.onrender.com` URL.
- **Supabase** is the Postgres database for Medusa **and** the bucket for
  product images. Already provisioned.
- **Clerk** is customer login on the storefront. Already provisioned.

---

## Step 1 — Push the repo to GitHub

```bash
git remote add origin git@github.com:<you>/foalandpony.git
git push -u origin main
```

> Confirm `.env`, `.env.local`, `medusa/.env` are gitignored before pushing.
> Quick check: `git ls-files | grep -E "^\.env"` should print nothing.

---

## Step 2 — Deploy the storefront to Vercel

You said the domain is already attached. So:

1. Vercel dashboard → **New Project** → import the GitHub repo.
2. Framework: **Next.js** (auto-detected from `vercel.json`).
3. Root directory: **leave as `.`** (`.vercelignore` already excludes the
   `medusa/` folder).
4. Build command: `next build` (default).
5. **Environment Variables** — paste in:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | from Clerk dashboard |
   | `CLERK_SECRET_KEY` | from Clerk dashboard |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://afmmqcmfmwimkkykxrby.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase API settings |
   | `SUPABASE_SERVICE_ROLE_KEY` | from Supabase API settings (server-only) |
   | `NEXT_PUBLIC_DEFAULT_REGION` | `in` |
   | `MEDUSA_BACKEND_URL` | *(set after Step 3 — for now leave blank)* |
   | `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | *(set after Step 3)* |
   | `ADMIN_HOST` | `admin.foalandpony.com` |
   | `ADMIN_ORIGIN` | *(set after Step 3 — the Render URL)* |

6. Deploy.

> The storefront builds and runs cleanly even with Medusa env vars blank.
> The `/shop` page falls back to the "stocking up" empty state.

---

## Step 3 — Deploy Medusa to Render

1. Push the repo to GitHub if you haven't already (Step 1).
2. Render dashboard → **New** → **Blueprint** → connect the repo.
3. Render reads `render.yaml` and proposes a service called
   `foalandpony-medusa`. Hit **Apply**.
4. Fill in the secret env vars Render asks for:

   - `DATABASE_URL` — from Supabase → Project Settings → Database →
     Connection string → **Transaction pooler** (port 6543). Format:
     ```
     postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
     ```
   - `SUPABASE_URL` — your project URL.
   - `SUPABASE_SERVICE_ROLE_KEY` — Supabase → Project Settings → API.
   - Skip Razorpay/Brevo for now if checkout/email isn't live yet.

5. Render builds Medusa and gives you a public URL like
   `https://foalandpony-medusa.onrender.com`. **Copy it.**

6. Open a shell on Render (or run locally against the new DB) to seed the
   schema and create the first admin user:

   ```bash
   cd medusa
   npx medusa db:migrate
   npx medusa user --email you@foalandpony.com --password <strong-password>
   ```

7. Visit `https://foalandpony-medusa.onrender.com/app`, log in, go to
   **Settings → Publishable API Keys**, create a key, copy it.

---

## Step 4 — Wire the storefront to Medusa

Back in Vercel → Project → Settings → Environment Variables, fill in:

| Key | Value |
|---|---|
| `MEDUSA_BACKEND_URL` | `https://admin.foalandpony.com` |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | the key from Step 3.7 |
| `ADMIN_ORIGIN` | `https://foalandpony-medusa.onrender.com` |

> Note: `MEDUSA_BACKEND_URL` points at the **public proxy** subdomain, not
> the Render URL directly. That keeps the storefront origin clean and the
> Render URL never appears in any browser network tab.

Redeploy the storefront (Deployments → ⋯ → Redeploy).

---

## Step 5 — Add the admin subdomain on Vercel

This is the trick that makes everything land on `admin.foalandpony.com`:

1. Vercel → your storefront project → **Domains** → **Add**.
2. Enter `admin.foalandpony.com`.
3. Vercel asks for DNS records — add them to your domain registrar
   (or if Vercel already manages the apex `foalandpony.com`, it auto-creates
   the record).
4. Wait for the green check (usually ~30 seconds).

That's it. Vercel terminates SSL on `admin.foalandpony.com` and the
`next.config.js` rewrite proxies all paths through to Render. The company
team's browser shows `admin.foalandpony.com/app/...`, never the Render URL.

---

## Step 6 — Create the company team logins

In Render shell again, for each person on the company team:

```bash
cd medusa
npx medusa user --email name@company.com --password <temporary>
```

Send them:
- URL: `https://admin.foalandpony.com/app`
- Their email + temporary password
- The "how to add a product" doc (see below)

---

## Step 7 — Hand over the product-add guide

Create a Notion page or PDF for the company team with these screenshots and
steps. Once the admin is live with their actual URL, I can draft this with
real screenshots — for now the outline is:

1. Log in at admin.foalandpony.com/app
2. Click **Products → Create product**
3. Fill in: title (e.g. "LUNA"), description, status = Published
4. Add **variants** for each colour (one variant per colour, with its own
   image, price, and stock)
5. Upload images (drag-and-drop, multiple per product or per variant)
6. Add to a **collection** — Ages 4–7, Ages 8–12, or Ages 13+
7. Save. It's live on foalandpony.com/shop within seconds.

---

## Local development

```bash
# Storefront (this folder)
npm install
cp .env.example .env.local         # fill in Clerk + Supabase keys
npm run dev                        # → http://localhost:3000

# Medusa (separate terminal)
cd medusa
yarn install
cp .env.example .env               # fill in DATABASE_URL pointing at Supabase
yarn dev                           # → http://localhost:9000
```

Set `MEDUSA_BACKEND_URL=http://localhost:9000` and `ADMIN_ORIGIN=http://localhost:9000`
in `.env.local` while you develop. The proxy rewrite in `next.config.js`
automatically uses the env var, so localhost works the same way as production.

---

## Costs

| Service | Tier | Approx. monthly |
|---|---|---|
| Vercel (Hobby) | Free | ₹0 |
| Render (Starter web service, Singapore region) | Starter | ~₹600 |
| Supabase (Pro for storage + DB) | Free → Pro | ₹0 – ₹2,000 |
| Clerk (Free tier) | Free up to 10k MAU | ₹0 |
| Domain | foalandpony.com | ~₹85/mo amortised |
| **Total at launch** | | **~₹700 – ₹2,800 / month** |

---

## What's not deployed yet (optional later)

- **Razorpay checkout** — set `RAZORPAY_*` env vars in Render when ready.
- **Brevo transactional email** — set `BREVO_*` env vars.
- **Cloudflare R2 image CDN** — if Supabase Storage egress gets expensive,
  swap to R2. Image domain whitelisted in `next.config.js`.

---

## Troubleshooting

**The /shop page shows the empty state even after seeding products.**
- Confirm `MEDUSA_BACKEND_URL` and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` are
  set in Vercel and the deployment has been re-triggered after the change.
- Confirm products are **Published** (not draft) in the admin.
- Open `https://admin.foalandpony.com/store/products` in a browser — if you
  get a 401 or empty list, the publishable key is wrong.

**admin.foalandpony.com loads the storefront, not the admin.**
- The `ADMIN_HOST` env var on Vercel must exactly match the subdomain you
  added. Case-sensitive.
- After changing env vars, redeploy. Rewrites are baked at build time.

**Render service sleeps and is slow to wake up.**
- Starter plan sleeps after 15 min of inactivity. Upgrade to Standard
  (~₹2,000/mo) if cold-start latency becomes an issue.
