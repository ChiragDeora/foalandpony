# Foal & Pony — Ecommerce Structure

Headless commerce: **Medusa** (catalog, cart, orders, admin CMS) + **Next.js** (storefront) + **Clerk** (customer auth) + **Supabase** (Postgres for Medusa + profile/review tables) + **Razorpay** + **Brevo**.

See **[AUTH.md](AUTH.md)** for how Clerk, Supabase, and Medusa work together.

> **Status:** Storefront scaffolded — `/shop`, `/cart`, `/checkout`, shop nav, Medusa data layer. Connect Medusa + publishable key to load products.

---

## Repository layout (target)

```
foalandpony/
├── app/
│   ├── page.tsx                    # Marketing homepage (existing)
│   ├── layout.tsx                  # Root layout + metadata
│   ├── globals.css                 # Marketing + shop styles
│   ├── (shop)/                     # Storefront route group
│   │   ├── layout.tsx              # Shop header/footer
│   │   ├── shop/
│   │   │   ├── page.tsx            # Product grid
│   │   │   └── [handle]/page.tsx   # PDP + variant picker
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── order/[id]/page.tsx
│   │   └── account/page.tsx        # Placeholder
│   └── policies/
│       ├── shipping/page.tsx
│       ├── returns/page.tsx
│       └── privacy/page.tsx
├── components/shop/
│   ├── ShopHeader.tsx
│   ├── ShopFooter.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── VariantSelector.tsx
│   ├── AddToCartButton.tsx
│   ├── CartLineItem.tsx
│   ├── CartSummary.tsx
│   ├── CheckoutForm.tsx
│   └── BackendStatusBanner.tsx
├── lib/
│   ├── config.ts                   # Medusa JS SDK
│   ├── constants.ts                # DEFAULT_COUNTRY = "in"
│   ├── data/
│   │   ├── cookies.ts
│   │   ├── regions.ts
│   │   ├── products.ts
│   │   ├── collections.ts
│   │   └── cart.ts
│   └── util/
│       ├── money.ts
│       └── medusa-error.ts
├── scripts/
│   ├── import-catalog.ts           # CSV → Medusa Admin API
│   └── sample-catalog.csv
├── medusa/                         # Cloned from medusa-starter-default
│   ├── medusa-config.ts
│   ├── package.json
│   └── src/
│       ├── scripts/seed.ts
│       └── subscribers/
│           └── order-placed-brevo.ts # Brevo stub
├── docker-compose.yml              # Postgres + Redis for local dev
├── .env.example                    # Storefront env template
└── package.json                    # + @medusajs/js-sdk, server-only
```

---

## Local development

### 1. Infrastructure

```bash
docker compose up -d
```

Runs Postgres (`5432`) and Redis (`6379`).

### 2. Medusa backend

```bash
cd medusa
cp .env.template .env
# Set DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa-v2
yarn install
yarn medusa db:migrate
yarn seed
yarn dev
```

- API: http://localhost:9000  
- Admin: http://localhost:9000/app  

Create a **Publishable API Key** in Admin → Settings → Publishable API Keys → copy to storefront `.env.local`.

### 3. Storefront

```bash
cd ..
cp .env.example .env.local
npm install
npm run dev
```

- Store: http://localhost:3000/shop  

---

## Environment variables

### Storefront (`.env.local`)

```bash
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_DEFAULT_REGION=in
```

### Medusa (`medusa/.env`)

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa-v2
REDIS_URL=redis://localhost:6379
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000,http://localhost:5173
AUTH_CORS=http://localhost:9000,http://localhost:3000
JWT_SECRET=change-me
COOKIE_SECRET=change-me
```

### Brevo (Medusa subscriber / API route)

```bash
BREVO_API_KEY=
BREVO_SENDER_EMAIL=hello@foalandpony.com
```

### Razorpay (Medusa payment module — Phase 1b)

```bash
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

---

## Bulk catalog import (10k SKU path)

1. Maintain `scripts/sample-catalog.csv` (expand to full export).
2. Bulk-upload images to Cloudflare R2 / S3; put CDN URLs in `image_url` column.
3. Run:

```bash
MEDUSA_BACKEND_URL=http://localhost:9000 \
MEDUSA_ADMIN_TOKEN=... \
npx tsx scripts/import-catalog.ts scripts/your-catalog.csv
```

CSV columns: `product_handle`, `title`, `description`, `collection`, `variant_sku`, `option_color`, `option_age`, `price_inr`, `inventory`, `image_url`.

---

## Medusa Admin = your CMS

- Products, variants, options (color, age band)
- Collections (Adventure / Explorer / Champion)
- Inventory, orders, promotions
- No custom `/admin` in Next.js

---

## Payments & email (next steps after scaffold)

| Piece | Action |
|-------|--------|
| Razorpay | Add Medusa payment provider module + webhook |
| Brevo | Implement `order-placed-brevo.ts` subscriber |
| Search | Add Meilisearch when catalog > ~500 SKUs |

---

## npm scripts (root `package.json`)

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:medusa": "cd medusa && yarn dev",
    "db:up": "docker compose up -d",
    "import:catalog": "tsx scripts/import-catalog.ts"
  }
}
```

---

## Homepage integration

- Nav link: **Shop** → `/shop`
- Hero CTA: **Shop now** → `/shop`
- Collection cards → `/shop?collection=adventure-series`

---

## Deployment

| App | Host |
|-----|------|
| Next.js storefront | Vercel |
| Medusa + Admin | Railway / Render / Fly |
| Postgres | Neon |
| Redis | Upstash |
| Images | Cloudflare R2 |
