# Basera Restaurant & Hotel — website

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide · Drizzle + PostgreSQL · Nodemailer

## File structure

```
src/
  data/business.ts          ← ALL editable content: contact, menu, prices, images, services
  lib/
    validation.ts           ← shared client + server validation & sanitising
    order.ts                ← cart maths (prices always resolved from business.ts)
    whatsapp.ts             ← the only place wa.me links/messages are built
    mailer.ts               ← SMTP email templates (server only)
    rate-limit.ts           ← basic spam throttling
  db/schema.ts              ← `enquiries` table (backup copy of every enquiry / order)
  app/
    layout.tsx              ← fonts, SEO metadata, JSON-LD, header/footer/sticky CTA
    page.tsx                ← Home
    about/ restaurant/ menu/ hotel/ banquet/ gallery/ contact/ order/
    api/contact/route.ts    ← enquiry endpoint (contact, hotel, banquet forms)
    api/order/route.ts      ← order-by-email endpoint
    api/health/route.ts
  components/
    Header, Footer, StickyMobileCta, WelcomeBubble, GreetingChip, useGreeting
    MenuBrowser, OrderSummary, OrderCheckout, CartProvider
    EnquiryForm, EnquiryModal, WhatsAppButton, Photo, Reveal, PageHero
    sections/ Hero, Features, About, Restaurant, Hotel, Banquet, Gallery, ContactInfo, CtaBand
```

## Install & run

```bash
npm install
cp .env.example .env        # then fill in the values
npx drizzle-kit push        # creates the enquiries table
npm run dev                 # http://localhost:3000
npm run build && npm start  # production
```

## Environment variables (server only, never exposed to the browser)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `BUSINESS_EMAIL` | **Inbox that receives enquiries & orders** (`YOUR_BUSINESS_EMAIL` in `.env.example`) |
| `EMAIL_HOST` / `EMAIL_PORT` | SMTP server (465 = SSL, 587 = STARTTLS) |
| `EMAIL_USER` / `EMAIL_PASSWORD` | SMTP login (use an app password for Gmail) |
| `EMAIL_FROM` | optional "From" header |
| `NEXT_PUBLIC_SITE_URL` | public site URL for SEO / Open Graph |

### Configure the business email
1. Put the receiving address in `BUSINESS_EMAIL`.
2. Put your SMTP details in the other `EMAIL_*` variables.
3. Restart. Every enquiry now emails the business, and customers who gave an email get a confirmation.

Until SMTP is configured the forms still work: each submission is saved in the `enquiries` table
(`select * from enquiries order by created_at desc;`) and flagged `not_configured`.

## Change menu items & prices
Open `src/data/business.ts`:
- Dishes: edit the `rawMenu` object (`["Name", "Description"]`).
- Prices: add to `PRICES`, e.g. `"paneer-butter-masala": 260`. The id is the dish name in lowercase with dashes.
  Anything without a price shows "Price on request", and the order summary handles mixed priced / unpriced carts.

## Replace images
Put real photos in `public/photos/` and change the entries in `images` / `galleryImages`
from `{ pexelsId: 123 }` to `{ src: "/photos/dining-hall.jpg" }`. The stock-photo notices in the footer and gallery
can be removed once all photos are real.

## Google Maps link
Paste the share link into `business.mapsLink`. Without it, the map embeds a search for the written address.

## Deploy
Any Node host (Vercel, Railway, Render, a VPS): set the env vars above, provide a PostgreSQL database,
run `npx drizzle-kit push` once, then `npm run build && npm start`.

## Testing checklist
- [ ] Every page loads; no horizontal scroll at 320 / 375 / 390 / 430 / 768 / 1024 / 1440 px
- [ ] Mobile menu opens, closes (link, Esc, X) and traps no scroll afterwards
- [ ] Menu: add, +, −, remove, clear; cart survives a refresh; "Proceed to Order" works
- [ ] Order form validation (name, phone, delivery address); WhatsApp opens with the full message; email order shows success and clears the cart
- [ ] Hotel / banquet modals: validation, email send, WhatsApp enquiry; Esc closes
- [ ] Contact form: all fields, success + error states, button disabled while sending
- [ ] Every WhatsApp button opens `wa.me/919412278120` with the right pre-filled text
- [ ] Gallery filters and lightbox (arrow keys, Esc)
- [ ] Keyboard: Tab order, visible focus, skip link
- [ ] Real SMTP test: submit a form, check the business inbox and the customer confirmation
