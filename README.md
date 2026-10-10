# Ember & Root

> **Slow-grown heat.** A small-batch hot sauce storefront: six varieties, a bundle builder, a custom checkout and real (test-mode) card payments.

**Live demo:** https://flavor-site-gilt.vercel.app

> This is a portfolio / learning project. Payments run on **Stripe's test environment**, so no real money moves and only Stripe test cards work. Brand copy, customer letters and legal text are placeholders.

<!-- Add screenshots to /docs and link them here, for example:
![Home](docs/home.png)
-->

---

## Highlights

**Storefront**
- Mega-menu navbar with a live flavor preview, a scrolling info ticker, and hide-on-scroll behaviour
- Hero built as a draggable, autoplaying D-shaped arc carousel with 3D-drifting SVG props, continuous color blending, canvas embers and keyboard control
- Scroll-driven brand story, an ingredients "specimen drawer" with a magnifying loupe, and a drag-able letters desk
- Shop page with heat filtering, sorting and per-size pricing, all kept in the URL so links and the back button work
- Product pages that take over the whole page in the flavor's color, with a bottle/spec/plate gallery, size options and a heat "dose" slider
- Bundles: a build-your-own **Trio Box** and curated **Gift sets** with a printed message card

**Commerce**
- Persistent cart drawer with a free-shipping progress ruler
- Checkout with country-aware fields, validation, a live order summary and printable order slips
- **Stripe** card payments (Payment Element) with signed webhooks, plus **Cash on delivery**
- PayPal and Easypaisa appear as design-only options
- Order tracking by order number and email, and a signed-in order history

**Accounts**
- Full-screen split sign-in / sign-up screen with animated panel transitions
- Custom session-based authentication (details below)

**Backend and operations**
- Serverless API on Vercel with a Neon Postgres database
- Contact form and newsletter ("batch list") signup stored in the database
- Admin dashboard endpoint for store activity
- Daily cron job that reconciles or cancels abandoned card orders

**Content**
- Heat guide, FAQ, shipping and returns, privacy, terms, and a custom 404 page

---

## Tech stack

| Area | Tools |
|---|---|
| Frontend | React 19, Vite, React Router, Tailwind CSS v4 |
| Motion | Framer Motion, CSS 3D transforms, Canvas |
| State | Zustand (with `persist` for the cart) |
| Payments | Stripe (PaymentIntents, Payment Element, webhooks) |
| Backend | Vercel Serverless Functions (Node.js, ESM) |
| Database | Neon Postgres via `@neondatabase/serverless` |
| Hosting | Vercel |
| Type | Fraunces, Hanken Grotesk, IBM Plex Mono (Google Fonts) |

---

## How it works

### Prices are decided on the server
The browser sends only product IDs, sizes and quantities. The server rebuilds the cart from its own catalog, recalculates every total (including bundle discounts, shipping and the cash-on-delivery fee) with the same shared pricing code the UI uses, and saves a snapshot of each line with the order. Any price sent by a client is ignored.

### Card payment flow
1. The customer fills in the form and the Stripe Payment Element validates the card fields in the browser. Card numbers never touch this app's code.
2. `POST /api/orders` saves a `pending` order and creates a PaymentIntent for the exact saved amount (charged in USD at a placeholder rate).
3. The browser confirms the payment with Stripe (3D Secure is handled by Stripe).
4. Stripe calls `POST /api/stripe/webhook`. The server verifies the signature and marks the order `paid`. The update is idempotent and only applies when the amount matches.
5. The confirmation page polls the order. As a fallback, the order endpoint asks Stripe directly when it finds a `pending` card order, and a nightly job reconciles anything left over.
6. A retry after a declined card reuses the same order and PaymentIntent instead of creating duplicates.

### Authentication
- Passwords are hashed with **scrypt** and a per-user salt
- Sessions are random tokens in an **HttpOnly, SameSite=Lax** cookie (`Secure` over HTTPS). Only a **hash** of the token is stored
- Login and sign-up are rate limited in the database, and login timing is equalized so response time does not reveal whether an email exists
- State-changing requests check the `Origin` header and require JSON
- Order confirmation links carry a secret token, so order numbers alone cannot be guessed

---

## Project structure

```
api/                     Vercel serverless functions
  _lib/                  Shared server helpers (db, stripe, auth, order shaping)
  auth/[action].js       me / login / signup / logout / orders
  orders/                Create order, fetch order, lookup by number + email
  stripe/webhook.js      Signed Stripe webhook
  cron/cleanup.js        Nightly reconciliation of abandoned card orders
  contact.js             Contact form
  subscribe.js           Newsletter / batch list
  admin/                 Admin dashboard endpoint
db/                      SQL schema and migration helpers
src/
  components/            hero, layout, sections, story, ingredients, letters,
                         newsletter, product, cart, checkout, shop, auth, ui
  data/                  Catalog, bundles, copy and page content
  lib/                   Pricing, validation and shared helpers (also used by the API)
  pages/                 Route-level pages
  store/                 Zustand stores (cart, auth, last order)
vercel.json              Rewrites, security headers, region, cron schedule
```

The `api/` code imports pricing and validation straight from `src/`, so the browser and the server always agree.

---

## Getting started

### Prerequisites
- Node.js 20 or newer
- A [Vercel](https://vercel.com) account and the Vercel CLI (`npm i -g vercel`)
- A [Neon](https://neon.tech) Postgres database (the Vercel Marketplace integration works well)
- A [Stripe](https://stripe.com) account in test mode, and the [Stripe CLI](https://stripe.com/docs/stripe-cli)

### Setup

```bash
git clone https://github.com/AhmedAyoub5757/Ember-Root.git
cd Ember-Root
npm install

# link the folder to your Vercel project
vercel link
```

1. **Create the tables.** Run the SQL in `db/schema.sql` and `db/contact-newsletter.sql` against your Neon database (the Neon SQL editor works, or see `db/migrate.js`).
2. **Create `.env.local`** with the variables below.
3. **Start the app.** Use `vercel dev`, which serves the Vite app and the `/api` functions together (normally on `http://localhost:3000`):

   ```bash
   vercel dev
   ```
4. **Forward Stripe webhooks** in a second terminal and copy the `whsec_…` secret it prints into `.env.local`, then restart `vercel dev`:

   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

> Use a separate database branch for local development, so test orders and accounts do not appear on your live site.

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (pooled) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_…`). It is baked into the build, so redeploy after changing it |
| `STRIPE_WEBHOOK_SECRET` | Signing secret of the webhook endpoint (the Stripe CLI prints a different one for local use) |
| `CRON_SECRET` | Random string (32+ characters) that protects the cron endpoint |

Additional variables used by the admin and email helpers are read in `api/_lib/env.js`.

Never commit `.env.local`. Only values prefixed with `VITE_` are exposed to the browser.

### Stripe test cards

| Card number | Result |
|---|---|
| `4242 4242 4242 4242` | Succeeds |
| `4000 0025 0000 3155` | Requires 3D Secure |
| `4000 0000 0000 9995` | Declined (insufficient funds) |

Use any future expiry date, any CVC and any postal code.

### Scripts

| Command | What it does |
|---|---|
| `vercel dev` | Frontend and API together (recommended) |
| `npm run dev` | Vite only (no API) |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |

---

## Deployment (Vercel)

1. Import the repository into Vercel and add the environment variables above for **Production** (and **Preview** if needed).
2. In `vercel.json`, set `regions` to the Vercel region closest to your database (for example `["iad1"]` for Neon `us-east-1`). It must be a valid Vercel region code. An invalid value makes Vercel reject every build.
3. In the Stripe dashboard (test environment), add a webhook endpoint at `https://YOUR-DOMAIN/api/stripe/webhook` for `payment_intent.succeeded` and `payment_intent.payment_failed`, and use **that endpoint's** signing secret as `STRIPE_WEBHOOK_SECRET`.
4. The cron job in `vercel.json` runs daily on production deployments and needs `CRON_SECRET`.
5. Ship changes with `git push`. The **Redeploy** button only rebuilds an old commit.

---

## Known limitations

- Payments are in **Stripe test mode**. Going live requires live keys, a verified business and a live webhook endpoint.
- PayPal and Easypaisa are UI only.
- No email verification or password reset yet, and no change-password or delete-account screens.
- Card payments are charged in USD at a fixed placeholder exchange rate (`PKR_PER_USD` in `src/lib/money.js`).
- Customer letters, statistics, legal pages, contact details and batch dates are **placeholders** and must be replaced before real use.
- The free Vercel and Neon plans have cold starts, so the first request after a quiet period can be slower.

---

## Credits

- Typefaces: Fraunces, Hanken Grotesk and IBM Plex Mono (Google Fonts, SIL Open Font License)
- Product, label and hero imagery was generated with AI image tools. Botanical illustrations and the line drawings in the interface are original or drawn in code

---

## Author

Built by **Ahmed Ayoub** ([@AhmedAyoub5757](https://github.com/AhmedAyoub5757)).

This is a portfolio project. All rights reserved unless a license file says otherwise.