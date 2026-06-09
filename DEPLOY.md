# Deploying Foal & Pony

Single host, single deploy. Storefront and admin live on the same Vercel project.

```
┌──────────────────────────────────────────────────────────────────┐
│  foalandpony.com           →  Vercel  →  Next.js storefront      │
│  admin.foalandpony.com     →  Vercel rewrite  →  /studio (Sanity)│
│  cdn.sanity.io             →  Sanity-hosted product images       │
└──────────────────────────────────────────────────────────────────┘
```

- **Vercel** hosts everything — public site + embedded Sanity Studio at `/studio`.
- **Sanity** is the CMS the company team logs into to add products. It hosts
  the product data and images on their CDN.
- **Clerk** handles customer login on the storefront. Optional at launch.
- **No backend server to run.** No Render, no Railway, no Postgres to babysit.

---

## Step 1 — Create the Sanity project (5 min)

1. Go to https://www.sanity.io and sign up (Google login works).
2. **Create new project** → name it "Foal & Pony" → pick the **production**
   dataset → public visibility (read-only public, write-protected by auth).
3. Open the project in https://www.sanity.io/manage. Copy two values from
   the API tab:
   - **Project ID** (looks like `a1b2c3d4`)
   - **Dataset** (will be `production`)
4. Under **API → CORS Origins**, add:
   - `http://localhost:3000`
   - `https://foalandpony.com`
   - `https://admin.foalandpony.com`
   - Tick **Allow credentials** for each.
5. Under **Members**, invite each company team member by email. They get a
   Sanity SSO login, no passwords to manage.

---

## Step 2 — Push the repo to GitHub

```bash
git add .
git commit -m "Switch to Sanity CMS"
git push
```

> Confirm `.env`, `.env.local` are gitignored. Quick check:
> `git ls-files | grep -E "^\.env"` should print only `.env.example`.

---

## Step 3 — Deploy to Vercel

You said the domain is already attached. So:

1. Vercel dashboard → **New Project** → import the GitHub repo.
2. Framework: **Next.js** (auto-detected).
3. **Environment Variables** — paste:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | from Step 1.3 |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-01` |
   | `ADMIN_HOST` | `admin.foalandpony.com` |
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | from Clerk (optional) |
   | `CLERK_SECRET_KEY` | from Clerk (optional) |

4. Deploy. The site goes live; `/shop` shows the "stocking up" empty state
   until products are added.

> Sanity vars all start with `NEXT_PUBLIC_` because the embedded Studio
> needs them at build time on the client.

---

## Step 4 — Add the admin subdomain on Vercel

1. Vercel → project → **Domains** → **Add**.
2. Enter `admin.foalandpony.com`.
3. Vercel auto-creates the DNS record (since it manages the apex).
4. Wait ~30 seconds for the green check.

That's it. The rewrite in `next.config.js` catches the `admin.foalandpony.com`
host and serves the Sanity Studio at `/studio`. The company team's browser
shows `admin.foalandpony.com` and nothing else.

---

## Step 5 — Test it end-to-end

1. Visit `https://admin.foalandpony.com`. You should see the Sanity Studio
   sign-in screen.
2. Log in with the email you used for the Sanity project.
3. Click **Catalogue → All products → Create new**.
4. Fill in the LUNA model as a test:
   - Name: LUNA
   - Age band: Ages 4 to 7
   - Size code: 45-15-130
   - Add one colour with a hex like `#7BABE0` and an image.
   - Tick **Published**.
5. Hit **Publish**.
6. Visit `https://foalandpony.com/shop`. LUNA appears on the grid within
   ~60 seconds (Next.js revalidates).

---

## Step 6 — Hand over to the company team

Send them:
- **URL**: `https://admin.foalandpony.com`
- **How to log in**: with the email they got the Sanity invite on.
- **What to do**: Click "Create new product" for each model. Fill in name,
  age band, description, size code, colours (with hex + image per colour),
  tick Published, hit Publish.

When the admin is live with their real URL, I can write a one-pager with
screenshots showing the exact flow.

---

## Local development

```bash
npm install
cp .env.example .env.local       # fill in the Sanity IDs from Step 1
npm run dev                      # → http://localhost:3000

# Studio is at:
#   http://localhost:3000/studio
```

To preview as the admin subdomain locally, add this to your `/etc/hosts`:

```
127.0.0.1 admin.foalandpony.local
```

Then visit `http://admin.foalandpony.local:3000` and set `ADMIN_HOST=admin.foalandpony.local` in `.env.local`.

---

## Costs

| Service | Tier | Approx. monthly |
|---|---|---|
| Vercel (Hobby) | Free | ₹0 |
| Sanity (Free tier) | 3 users, 500k API requests, 5GB assets | ₹0 |
| Clerk (Free tier) | up to 10k MAU | ₹0 |
| Domain | foalandpony.com | ~₹85/mo amortised |
| **Total** | | **~₹85 / month** |

The free tiers comfortably fit a 19-product brand site for years.

### When to upgrade

- **Sanity Growth** ($15/mo) — when you exceed 3 team members.
- **Clerk Pro** ($25/mo) — when team SSO matters.
- **Vercel Pro** ($20/mo) — for team collaboration / analytics.

---

## Adding products in bulk (one-time seed)

If you want to drop in all 19 models from the Website Plan doc at once
instead of typing them in by hand, ping me and I'll write a Sanity import
script that reads the data and creates the documents via the Sanity API.

---

## Troubleshooting

**`/shop` shows the empty state even after publishing a product.**
- Confirm the product has **Published** ticked (not just saved as a draft).
- Wait ~60s — Next.js revalidates the GROQ cache on that interval.
- Confirm `NEXT_PUBLIC_SANITY_PROJECT_ID` is set in Vercel and the
  deployment has been redeployed since the env var was added.

**admin.foalandpony.com loads the storefront, not the Studio.**
- The `ADMIN_HOST` env var on Vercel must exactly match the subdomain (case-sensitive).
- Rewrites are baked at build time — redeploy after changing env vars.

**Sanity Studio errors out with "missing CORS origin".**
- Add the storefront and admin URLs in sanity.io/manage → API → CORS Origins.

**Image upload fails in Studio with "asset upload error".**
- Sanity hosts images on their own CDN — no extra storage to set up. If it
  fails, check your project's quota in sanity.io/manage (free tier is 5GB).
