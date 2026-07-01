# Foal & Pony — Codebase Index

Marketing + storefront site for **Foal & Pony**, a premium kids' eyewear brand (India, prices in ₹ INR). Currently in a **brand-presence** phase: the Shop/Cart/Checkout stack is built but the cart is disabled in the navbar and enquiries route through WhatsApp. Checkout writes orders to Supabase and sends a confirmation email; no payment gateway is wired yet.

## Stack
- **Next.js 15** App Router, React 18, TypeScript. Dev server on **port 3008** (`npm run dev`).
- **Sanity** (`^3.99`) — headless CMS for the product catalog. Studio embedded at `/studio`.
- **Clerk** — customer auth (optional; site runs without it).
- **Supabase** (Postgres) — user profiles, carts, orders. Accessed **server-side only** via service-role admin client (RLS bypassed; no client policies except public-read reviews).
- **Brevo** — transactional order-confirmation email.
- Styling: **Tailwind v4** (`@tailwindcss/postcss`) + hand-written CSS (`app/globals.css`, `app/store.css`) using `fp-` prefixed classes. `styled-components` is a dep but usage is minimal.
- Deploy: **Vercel**. See `DEPLOY.md` / `DEPLOYMENT.md`.

## Layout / entry points
- `app/layout.tsx` — root layout. Wraps `ClerkProvider` (only if publishable key set) + `ThemeProvider`. Loads Google Fonts. Sets `data-theme="kids"`.
- `app/page.tsx` (793 lines) — the homepage; large single-file marketing page with an inline SVG icon set.
- `app/(store)/layout.tsx` — store shell: `CartProvider` + `Navbar` + `Footer`. Reads Clerk `userId` server-side to decide `signedIn`.
- `middleware.ts` — Clerk middleware; protects `/account`, `/cart`, `/checkout`, `/api/customer/sync`. No-op when Clerk env is absent.

## Routes
Marketing (root segment): `/` `/fit` `/collections` `/blog` `/blog/[slug]` `/partner` `/games` `/games/brick-breaker`
Store `(store)` group: `/shop` `/shop/[handle]` `/cart` `/checkout` `/account` `/order/[id]` `/policies/{privacy,shipping,returns}`
Auth: `/sign-in` `/sign-up` (Clerk catch-all routes)
Admin: `/studio/[[...tool]]` — Sanity Studio. `next.config.js` rewrites the `ADMIN_HOST` (`admin.foalandpony.com`) subdomain → `/studio`.
API: `POST/PUT/GET /api/cart`, `POST /api/orders`, `POST /api/customer/sync`

## Data layer
- **Content lives in Sanity**, not the DB. Schemas in `sanity/schemas/`: `product.ts` (name, slug, tagline, price ₹, description, `ageBand` 4-7/8-12/13+, shape, sizeCode, technology, `colours[]` {name/hex/image}, lifestyleImages, published, featured, order); `blogPost.ts` (title, slug, category, coverImage, excerpt, portable-text body, SEO, published/featured); `homepage.ts` (**singleton** of homepage images — heroImage is a transparent-PNG cut-out, ourStoryImage, weightImage, smiles gallery). Studio sidebar (`sanity.config.ts`) shows Homepage / Blog posts / Products.
- `lib/sanity/` — `client.ts` (createClient + `urlFor` image builder + `isSanityConfigured`), `queries.ts` (GROQ), `products.ts` / `blog.ts` / `homepage.ts` (server fetchers), `types.ts` (`FoalProduct`, `BlogPost`, `Homepage`), `shapes.ts`, `colour-images.ts`.
- Homepage (`app/page.tsx`, a server component) and `/blog` read from Sanity with **fallbacks to the shipped `/public` assets / a "coming soon" empty state** so nothing breaks when the CMS is empty.
- Fetchers **swallow errors and return empty/null** so the storefront degrades to an on-brand empty state when Sanity is down/unconfigured. Reads are cached with `next: { tags: ['products'], revalidate: 60 }`.
- **Supabase** (`lib/supabase/`): `admin.ts` = service-role client (returns `null` if env unset — callers guard on this), `server.ts`, `client.ts`. Tables in `supabase/migrations/`: `user_profiles`, `reviews`, `orders` + `order_items`, `carts`. Orders/carts/order_items have RLS on with **no policies** — only the admin client touches them.

## Key flows
- **Cart** (`lib/cart/cart-context.tsx`): client context, localStorage-backed (`fp_cart_v1`). Line identity = `productId::colourName`. When signed in, merges guest cart with the server cart from `GET /api/cart`, then debounces `PUT /api/cart` (600ms) to persist to the `carts` table.
- **Checkout** (`POST /api/orders`): re-fetches product prices from Sanity (never trusts client prices), inserts `orders` + `order_items`, upserts `user_profiles` shipping info if signed in, best-effort Brevo email. Returns `orderId`.
- **Auth sync** (`lib/auth/sync-customer.ts` ← `/api/customer/sync` ← `components/auth/SyncCustomerOnVisit.tsx`): upserts a `user_profiles` row from the Clerk user on visit.
- **Theme** (`context/ThemeContext.tsx`): `kids` | `premium`, toggled via `data-theme` on `<html>`, persisted to localStorage (`fp-theme`).

## Components
- Top-level: `components/Navbar.tsx` (NAV_LINKS, mobile drawer, "Kids Zone" games button — **cart action is commented out**), `Footer.tsx`, `Decor.tsx`.
- `components/shop/*` — ProductGrid/Card/Gallery, Cart{View,LineItem,Summary}, CheckoutForm/View, Collections{View,Filters}, InteractiveSizeChart, Shop{Header,Nav,Footer,AuthActions}, AddToCart, ProductColourContext.

## Sanity Studio custom tools
`sanity/tools/`: `BulkImportTool.tsx` (CSV → products, see `scripts/sample-catalog.csv`), `PriceImportTool.tsx` (xlsx), `ColourSyncTool.tsx`. Config in `sanity.config.ts`, env in `sanity/env.ts`.

## Env vars (`.env.example`)
Sanity: `NEXT_PUBLIC_SANITY_PROJECT_ID/DATASET/API_VERSION`, `ADMIN_HOST`. Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, sign-in/up URLs. Supabase: `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Email: `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`. **Every integration is optional** — the site builds and renders with all of them blank.

## Utilities
`lib/util/money.ts` (`formatInr`), `lib/util/colour.ts`, `lib/clerk-appearance.ts` (Clerk theming).

## Conventions & gotchas
- Path alias `@/*` → repo root (`tsconfig.json`).
- Prices are **integer whole rupees** (no paise) throughout — Sanity, DB, order math.
- Guard every integration behind its env check; degrade gracefully, never crash on missing config (established pattern in every `lib/` module).
- CSS classes are `fp-`-prefixed and defined in `app/globals.css` / `app/store.css`, not co-located with components.
- Extensive root-level docs exist: `AGENT_PLAN.md`, `AUTH.md`, `DEPLOY.md`, `DEPLOYMENT.md`, `ECOMMERCE.md`, `ref.md`, `SETUP.md`. Migrations reference a former **Medusa** commerce engine that has been removed (`drop_medusa_customer_id`).
