# GreenNest Microgreens

A ready-to-deploy e-commerce site for a microgreens business: customers browse
products, add to cart, pay via your UPI QR code, and upload a payment
screenshot to place an order. You get a password-protected admin panel to
add/edit/delete products, mark items sold out, review orders and payment
screenshots, and update your phone number, UPI ID, and QR code — no code
changes needed.

## What's inside

- **Storefront** (`/`) — product grid, cart, checkout with QR code + screenshot upload
- **Admin panel** (`/admin`) — password protected
  - `/admin/products` — add, edit, delete products; toggle in-stock / sold out; upload photos
  - `/admin/orders` — see every order, its payment screenshot, and confirm or reject it
  - `/admin/settings` — store name, tagline, phone, WhatsApp, UPI ID, QR code image, address

## 1. Push this to GitHub

Create a new GitHub repo, then from this folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Framework preset should auto-detect as **Next.js**. Leave build settings as default.
3. Before your first deploy finishes working end-to-end, you need two things
   set up (steps 3 and 4 below) — it's fine to deploy first and add them after.

## 3. Add storage (Redis + Blob) — both free

Your product list, orders, and settings live in a small Redis database.
Product photos, your QR code, and payment screenshots live in Blob storage.
Both are add-ons inside your Vercel project, no separate signup:

1. In your Vercel project, go to the **Storage** tab.
2. Click **Create Database** → choose a **Redis** database (Upstash, via the
   Marketplace) → follow the prompts → **Connect** it to this project.
3. Click **Create Database** again → choose **Blob** → **Connect** it to this
   project.
4. Vercel automatically adds the right environment variables
   (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, `BLOB_READ_WRITE_TOKEN`, etc.) —
   you don't need to type these in yourself.
5. Redeploy the project (Vercel prompts you to after connecting storage).

## 4. Set your admin password

In your Vercel project, go to **Settings → Environment Variables** and add:

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | the password you'll use to log into `/admin` |
| `ADMIN_SECRET` | any long random string (used to sign your login session — mash your keyboard) |

Redeploy after adding these.

## 5. Add your details

Once deployed, visit `yoursite.vercel.app/admin/login`, log in with the
password you set, and go to:

- **Settings** — upload your payment QR code, add your phone number, WhatsApp
  number, UPI ID, address, store tagline
- **Products** — add each product with a name, description, price, unit
  (e.g. "100g box"), and photo

Then visit your homepage — it's live.

## Running it locally (optional)

```bash
npm install
cp .env.example .env.local   # fill in ADMIN_PASSWORD and ADMIN_SECRET
npm run dev
```

Note: without connecting to real Redis/Blob storage (steps 3 above, or a
local Upstash/Blob dev setup), the site will show a "storage isn't connected"
message locally — this is expected and only matters for local testing. It
works automatically once deployed on Vercel with storage connected.

## Changing the look

- Colors and fonts: `tailwind.config.ts` and `app/layout.tsx`
- Homepage tagline/hero text: editable live from `/admin/settings`, or edit
  `app/page.tsx` for structural changes
- Everything else (products, prices, photos, stock, QR code, contact info) is
  editable from `/admin` — no redeploy needed.
