# Workers Spot — demo

Clickable React demo of Workers Spot. Customers search for an everyday job (plumbing, porter, cleaning, painting…), see how it's priced, book a slot and track the pro live. Payment happens after the job. An admin console at `/admin` runs the business behind it.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173  ·  admin: http://localhost:5173/admin
```

**Admin login:** username `admin`, password `admin`

## Pricing types

Each job has one of four pricing types:

- **Fixed rate:** one price for the whole job (e.g. tap fix ₹199).
- **Pay per hour:** the customer picks the number of hours, with a minimum (e.g. porter ₹199/hr, min 2 hrs).
- **Per day:** a worker or helper for a full day (e.g. ₹899/day).
- **Contract:** big or recurring work. The customer books a free site visit, and admin enters the quote afterwards.

## Demo script (about 2 minutes)

1. **Home page:** type `porter` in the big search bar. Point out the "Pay the way the job needs" section.
2. Book **Porter — loading & shifting**: choose 3 hours, pick a slot, click **Fill demo details**, then **Confirm**.
3. Click **Track this booking**. It shows a status card, a timeline, the OTP and payment status.
4. Click the black **Demo · Next status** button (bottom right) to move the job from on the way → work started → completed. Then click **Pay** and the job shows as paid.
5. **My bookings** also includes a live "on the way" job, with a moving route view, and a past paid job.
6. Open **/admin** in a second tab and sign in. Change a booking's status in **Bookings**, and the customer's tracking page updates live in the other tab.
7. In admin, change a price in **Job postings**, switch off a pricing type, or mark a worker unavailable. The website updates immediately.

## Admin console

| Page | What it does |
|---|---|
| Dashboard | Revenue this month and growth, 12-month revenue chart (hover for details), UPI/cash split, today's pipeline, bookings by category, upcoming jobs, worker performance |
| Bookings | Filter by stage, search, change status, reassign the worker, enter contract quotes, mark paid, cancel |
| Payments | Collected / due / worker payouts / margin, mark cash or UPI payments received |
| Job postings | Add, edit, hide or delete jobs: title, category, pricing type, rate, minimum hours, photo, keywords |
| Job types & pricing | Turn pricing types on/off and edit their wording; add, edit and hide categories |
| Workers | Add and edit workers, their skills, payout %, availability; see monthly jobs and earnings |
| Settings | Business name, phone, area, booking time slots, visit charge, payment methods, reset demo data |

## Notes

- All data is mock data, saved in the browser (localStorage). Use **Settings → Reset demo data** before a pitch.
- Photos load from Unsplash, so an internet connection is needed.
- `npm run build` creates `dist/` for Netlify or Vercel. The rewrite files for `/admin` and `/track/...` links are already included.
- Code: `src/data.js` holds the default content, `src/store.jsx` the shared data store, `src/components/` the customer site, and `src/admin/` the admin console.
