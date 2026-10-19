const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`

export const photo = img

/* ───────── Pricing types ───────── */
export const defaultPricingTypes = [
  { id: 'fixed', name: 'Fixed rate', unit: '', unitLabel: 'job', desc: 'One clear price for the whole job. No surprises.', icon: '🏷️', active: true },
  { id: 'hourly', name: 'Pay per hour', unit: '/hr', unitLabel: 'hour', desc: 'Pay only for the hours worked. Great for odd jobs.', icon: '⏱️', active: true },
  { id: 'daily', name: 'Per day', unit: '/day', unitLabel: 'day', desc: 'Book a worker or helper for a full working day.', icon: '📅', active: true },
  { id: 'contract', name: 'Contract', unit: '', unitLabel: 'project', desc: 'Big or recurring work. Free site visit and a written quote.', icon: '📝', active: true },
]

/* ───────── Categories ───────── */
export const defaultCategories = [
  { id: 'plumbing', name: 'Plumbing', tint: '#E6F4FF', image: img('1585704032915-c3400ca199e7'), emoji: '🚰', active: true },
  { id: 'electrical', name: 'Electrical', tint: '#FFF6DB', image: img('1621905251189-08b45d6a269e'), emoji: '💡', active: true },
  { id: 'moving', name: 'Porter & Moving', tint: '#FFEDE3', image: img('1600518464441-9154a4dea21b'), emoji: '📦', active: true },
  { id: 'cleaning', name: 'Cleaning', tint: '#E9F9EF', image: img('1581578731548-c64695cc6952'), emoji: '🧽', active: true },
  { id: 'painting', name: 'Painting', tint: '#F1ECFF', image: img('1562259949-e8e7689d7828'), emoji: '🎨', active: true },
  { id: 'carpentry', name: 'Carpentry', tint: '#FFF1E6', image: img('1589939705384-5185137a7f0f'), emoji: '🪚', active: true },
  { id: 'repairs', name: 'Home Repairs', tint: '#EAF2F2', image: img('1504148455328-c376907d081c'), emoji: '🛠️', active: true },
  { id: 'gardening', name: 'Gardening', tint: '#EEF7E4', image: img('1416879595882-3373a0480b5b'), emoji: '🌱', active: true },
]

/* ───────── Workers ───────── */
export const defaultTeam = [
  { id: 'ravi', name: 'Ravi Kumar', role: 'Plumber & Fitter', years: 9, rating: 4.9, jobs: 1240, phone: '98450 11201', image: img('1507003211169-0a1dd7228f2d', 500), skills: ['plumbing', 'repairs'], available: true, payout: 70 },
  { id: 'imran', name: 'Imran Shaikh', role: 'Electrician', years: 7, rating: 4.8, jobs: 980, phone: '98450 11202', image: img('1621905252507-b35492cc74b4', 500), skills: ['electrical', 'repairs'], available: true, payout: 70 },
  { id: 'arjun', name: 'Arjun Nair', role: 'Mover & Porter', years: 5, rating: 4.9, jobs: 860, phone: '98450 11203', image: img('1506794778202-cad84cf45f1d', 500), skills: ['moving', 'gardening'], available: false, payout: 65 },
  { id: 'meera', name: 'Meera Das', role: 'Cleaning Specialist', years: 6, rating: 5.0, jobs: 1105, phone: '98450 11204', image: img('1544005313-94ddf0286df2', 500), skills: ['cleaning', 'gardening'], available: true, payout: 70 },
  { id: 'joseph', name: 'Joseph Thomas', role: 'Carpenter & Painter', years: 12, rating: 4.8, jobs: 1530, phone: '98450 11205', image: img('1500648767791-00dcc994a43e', 500), skills: ['carpentry', 'painting', 'repairs'], available: true, payout: 72 },
]

/* ───────── Jobs (services) ───────── */
const S = (id, cat, title, pricing, price, duration, rating, reviews, imageId, tags, extra = {}) => ({
  id, cat, title, pricing, price, duration, rating, reviews, image: img(imageId, 700), tags, active: true, minUnits: 1, ...extra,
})

export const defaultServices = [
  S('s1', 'plumbing', 'Leaking tap or pipe fix', 'fixed', 199, '30–45 min', 4.9, 812, '1585704032915-c3400ca199e7', ['leak', 'tap', 'faucet', 'pipe', 'water']),
  S('s2', 'plumbing', 'Blocked drain & sink cleaning', 'fixed', 299, '45–60 min', 4.8, 540, '1607472586893-edb57bdc0e39', ['drain', 'block', 'sink', 'clog']),
  S('s3', 'plumbing', 'Bathroom fitting installation', 'fixed', 449, '1–2 hrs', 4.8, 233, '1584622650111-993a426fbf0a', ['shower', 'geyser', 'bathroom', 'toilet', 'flush']),
  S('s4', 'electrical', 'Fan, light or switch repair', 'fixed', 149, '30 min', 4.8, 1021, '1621905251918-48416bd8575a', ['fan', 'light', 'switch', 'socket', 'wiring']),
  S('s22', 'electrical', 'Electrician on call', 'hourly', 249, 'min 1 hr', 4.8, 377, '1621905251189-08b45d6a269e', ['electrician', 'wiring', 'hour', 'inverter', 'mcb']),
  S('s5', 'electrical', 'New wiring & MCB check', 'fixed', 399, '1–2 hrs', 4.7, 318, '1621905251189-08b45d6a269e', ['wiring', 'mcb', 'power', 'short circuit']),
  S('s6', 'moving', 'Porter — loading & shifting', 'hourly', 199, 'min 2 hrs', 4.9, 667, '1600518464441-9154a4dea21b', ['porter', 'shift', 'move', 'lift', 'carry', 'luggage', 'transport'], { minUnits: 2 }),
  S('s7', 'moving', 'Mini-truck house shifting', 'fixed', 1499, 'Half day', 4.8, 290, '1609143739217-01b60dad1c67', ['truck', 'shift', 'house', 'relocate', 'transport', 'move']),
  S('s18', 'moving', 'Helper / labour for a day', 'daily', 899, '9 AM – 6 PM', 4.8, 204, '1600518464441-9154a4dea21b', ['labour', 'helper', 'day', 'worker', 'porter']),
  S('s21', 'moving', 'Office or shop shifting', 'contract', 7999, '1–2 days', 4.9, 61, '1609143739217-01b60dad1c67', ['office', 'shop', 'shift', 'move', 'contract']),
  S('s8', 'cleaning', 'Full home deep cleaning', 'fixed', 1299, '4–5 hrs', 4.9, 742, '1581578731548-c64695cc6952', ['clean', 'deep', 'home', 'house', 'maid']),
  S('s9', 'cleaning', 'Sofa & carpet shampoo', 'fixed', 599, '1–2 hrs', 4.8, 410, '1527515637462-cff94eecc1ac', ['sofa', 'carpet', 'vacuum', 'clean']),
  S('s10', 'cleaning', 'Kitchen cleaning', 'fixed', 699, '2–3 hrs', 4.7, 288, '1600585152220-90363fe7e115', ['kitchen', 'chimney', 'clean']),
  S('s20', 'cleaning', 'Monthly cleaning plan', 'contract', 4999, '8 visits / month', 4.9, 92, '1556909114-f6e7ad7d3136', ['monthly', 'clean', 'plan', 'contract', 'maid', 'regular']),
  S('s11', 'painting', 'Single room painting', 'fixed', 2499, '1 day', 4.8, 156, '1562259949-e8e7689d7828', ['paint', 'wall', 'room', 'colour', 'color']),
  S('s12', 'painting', 'Painter for touch-ups', 'hourly', 299, 'min 2 hrs', 4.7, 98, '1574359411659-15573a27fd0c', ['paint', 'touch up', 'wall'], { minUnits: 2 }),
  S('s19', 'painting', 'Full house painting', 'contract', 14999, '4–6 days', 4.9, 74, '1574359411659-15573a27fd0c', ['paint', 'house', 'full', 'contract', 'exterior', 'interior']),
  S('s13', 'carpentry', 'Furniture assembly', 'fixed', 249, '45–90 min', 4.9, 521, '1589939705384-5185137a7f0f', ['furniture', 'assemble', 'bed', 'wardrobe', 'table']),
  S('s14', 'carpentry', 'Door, lock & hinge repair', 'fixed', 199, '30–60 min', 4.8, 377, '1530124566582-a618bc2615dc', ['door', 'lock', 'hinge', 'cupboard', 'drawer']),
  S('s15', 'repairs', 'Drilling & wall mounting', 'fixed', 179, '30 min', 4.9, 905, '1504148455328-c376907d081c', ['drill', 'tv', 'mount', 'shelf', 'curtain', 'hang']),
  S('s16', 'repairs', 'Handyman by the hour', 'hourly', 299, 'min 1 hr', 4.8, 612, '1581244277943-fe4a9c777189', ['handyman', 'fix', 'odd', 'small', 'repair', 'hour']),
  S('s17', 'gardening', 'Garden & balcony cleanup', 'fixed', 249, '1–2 hrs', 4.8, 201, '1416879595882-3373a0480b5b', ['garden', 'plants', 'balcony', 'lawn', 'pots']),
  S('s23', 'gardening', 'Gardener for a day', 'daily', 799, '9 AM – 5 PM', 4.7, 66, '1416879595882-3373a0480b5b', ['gardener', 'garden', 'day', 'lawn']),
]

export const defaultSettings = {
  businessName: 'Workers Spot',
  phone: '+91 90000 00000',
  email: 'hello@workersspot.in',
  area: 'HSR Layout',
  city: 'Bengaluru',
  visitFee: 49,
  waiveVisitFee: true,
  slots: [8, 10, 12, 14, 16, 18],
  upi: true,
  cash: true,
  guaranteeDays: 7,
}

export const reviews = [
  { name: 'Ananya R.', area: 'Indiranagar', text: 'Booked a plumber at 9am, Ravi was at my door by 11. Fixed the leak, showed me the old washer, and I paid by UPI after. That\'s it. No haggling.', rating: 5, color: '#0F9D58', job: 'Leaking tap fix' },
  { name: 'Karthik M.', area: 'HSR Layout', text: 'Booked two porters by the hour to move a fridge and a wardrobe to the 3rd floor. Done in under 2 hours, paid only for that.', rating: 5, color: '#FF7A59', job: 'Porter — per hour' },
  { name: 'Fatima S.', area: 'Koramangala', text: 'We took the monthly cleaning contract for our office. Same team every week, one invoice. Meera\'s team is unreal.', rating: 5, color: '#0C2A1F', job: 'Monthly cleaning plan' },
]

export const popularSearches = ['Leaking tap', 'Porter', 'Fan repair', 'Deep cleaning', 'Handyman', 'House painting']

/* ───────── Booking status pipeline ───────── */
export const STATUSES = [
  { key: 'booked', label: 'Booking received', short: 'Booked', desc: 'We’ve got your request.' },
  { key: 'assigned', label: 'Pro assigned', short: 'Assigned', desc: 'A verified pro has accepted your job.' },
  { key: 'enroute', label: 'On the way', short: 'On the way', desc: 'Your pro is heading to your address.' },
  { key: 'started', label: 'Work started', short: 'In progress', desc: 'Pro arrived and started after OTP check.' },
  { key: 'completed', label: 'Job completed', short: 'Completed', desc: 'Work finished. Please check and pay.' },
  { key: 'paid', label: 'Paid', short: 'Paid', desc: 'Payment received. Thank you!' },
]

/* ───────── Helpers ───────── */
export const rupee = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

export const priceLabel = (s, types = defaultPricingTypes) => {
  if (s.pricing === 'contract') return `from ${rupee(s.price)}`
  const t = types.find((p) => p.id === s.pricing)
  return rupee(s.price) + (t?.unit ?? '')
}

export const amountFor = (s, units) => (s.pricing === 'contract' ? null : s.price * (s.pricing === 'fixed' ? 1 : units))

export const fmtSlot = (h) => `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`
export const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const parseDay = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d) }

export const searchServices = (services, categories, q, cat, pricing) => {
  const t = q.trim().toLowerCase()
  return services.filter((s) => {
    if (cat && s.cat !== cat) return false
    if (pricing && s.pricing !== pricing) return false
    if (!t) return true
    const catName = categories.find((c) => c.id === s.cat)?.name.toLowerCase() ?? ''
    const hay = [s.title.toLowerCase(), catName, s.pricing, ...s.tags].join(' ')
    return t.split(/\s+/).every((w) => hay.includes(w) || hay.includes(w.replace(/s$/, '')))
  })
}

export const workerFor = (team, catId) =>
  team.find((m) => m.available && m.skills[0] === catId) ??
  team.find((m) => m.available && m.skills.includes(catId)) ??
  team.find((m) => m.skills.includes(catId)) ??
  team[0]

/* ───────── Seed bookings (deterministic) ───────── */
const CUSTOMERS = ['Ananya Rao', 'Karthik Menon', 'Fatima Sheikh', 'Rohit Verma', 'Sneha Iyer', 'Vikram Shetty', 'Pooja Nair', 'Aditya Joshi', 'Neha Gupta', 'Suresh Babu', 'Divya Krishnan', 'Manoj Pillai', 'Kavya Reddy', 'Rahul Jain', 'Lakshmi Prasad', 'Zoya Khan']
const AREAS = ['HSR Layout', 'Koramangala', 'Indiranagar', 'BTM Layout', 'Bellandur', 'Jayanagar', 'Whitefield', 'JP Nagar']

const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

export const buildEvents = (dateKey, hour, status, createdAt) => {
  const slot = parseDay(dateKey); slot.setHours(hour)
  const t = slot.getTime()
  const c = new Date(createdAt).getTime()
  const times = [c, c + 9 * 60e3, t - 35 * 60e3, t + 4 * 60e3, t + 95 * 60e3, t + 104 * 60e3]
  const ev = {}
  STATUSES.forEach((st, i) => { if (i <= status) ev[st.key] = new Date(times[i]).toISOString() })
  return ev
}

export function seedBookings(services, team) {
  const r = rng(42)
  const now = new Date()
  const out = []
  for (let i = 0; i < 150; i++) {
    const s = services[Math.floor(r() * services.length)]
    const pro = workerFor(team, s.cat)
    const offset = Math.floor(r() * 34) - 29 // -29 … +4 days
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
    const hour = [8, 10, 12, 14, 16, 18][Math.floor(r() * 6)]
    const units = s.pricing === 'fixed' || s.pricing === 'contract' ? 1 : s.minUnits + Math.floor(r() * 3)
    let status
    if (offset < 0) status = r() < 0.08 ? -1 : r() < 0.1 ? 4 : 5
    else if (offset === 0) status = 1 + Math.floor(r() * 3)
    else status = r() < 0.6 ? 1 : 0
    const created = new Date(d.getTime() - (1 + Math.floor(r() * 3)) * 864e5 + 9 * 3600e3)
    const quote = s.pricing === 'contract' ? Math.round((s.price * (1 + r() * 0.6)) / 100) * 100 : null
    const amount = s.pricing === 'contract' ? (status >= 1 ? quote : null) : amountFor(s, units)
    const name = CUSTOMERS[Math.floor(r() * CUSTOMERS.length)]
    out.push({
      id: 'WS' + (40120 + i * 7),
      serviceId: s.id, title: s.title, cat: s.cat, pricing: s.pricing, rate: s.price, units, amount,
      proId: pro.id, date: dayKey(d), hour,
      name, phone: '98' + String(Math.floor(10000000 + r() * 89999999)),
      address: `${Math.floor(r() * 400) + 1}, ${AREAS[Math.floor(r() * AREAS.length)]}, Bengaluru`,
      note: '', pay: r() < 0.68 ? 'upi' : 'cash',
      status: Math.max(status, 0), cancelled: status === -1,
      createdAt: created.toISOString(),
      events: status === -1 ? { booked: created.toISOString() } : buildEvents(dayKey(d), hour, status, created),
      otp: String(1000 + Math.floor(r() * 9000)), mine: false,
    })
  }
  // Two bookings that belong to the demo customer, so "My bookings" isn't empty.
  const today = dayKey(now)
  const h = Math.min(Math.max(now.getHours(), 8), 18)
  const pastDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
  const past = dayKey(pastDate)
  const pastCreated = new Date(pastDate.getTime() - 2 * 864e5 + 11 * 3600e3)
  out.unshift(
    {
      id: 'WS40088', serviceId: 's1', title: 'Leaking tap or pipe fix', cat: 'plumbing', pricing: 'fixed', rate: 199, units: 1, amount: 199,
      proId: 'ravi', date: today, hour: h, name: 'Priya Sharma', phone: '9845012345',
      address: 'Flat 302, Green Glen Apartments, 27th Main, HSR Layout Sector 2, Bengaluru', note: 'Kitchen sink tap', pay: 'upi',
      status: 2, cancelled: false, createdAt: new Date(now.getTime() - 3 * 3600e3).toISOString(),
      events: {
        booked: new Date(now.getTime() - 3 * 3600e3).toISOString(),
        assigned: new Date(now.getTime() - 170 * 60e3).toISOString(),
        enroute: new Date(now.getTime() - 14 * 60e3).toISOString(),
      },
      otp: '4821', mine: true,
    },
    {
      id: 'WS40031', serviceId: 's6', title: 'Porter — loading & shifting', cat: 'moving', pricing: 'hourly', rate: 199, units: 3, amount: 597,
      proId: 'arjun', date: past, hour: 10, name: 'Priya Sharma', phone: '9845012345',
      address: 'Flat 302, Green Glen Apartments, 27th Main, HSR Layout Sector 2, Bengaluru', note: 'Fridge + wardrobe to 3rd floor', pay: 'upi',
      status: 5, cancelled: false, createdAt: pastCreated.toISOString(),
      events: buildEvents(past, 10, 5, pastCreated), otp: '1907', mine: true,
    }
  )
  return out
}

/* Revenue for the 11 full months before the current one (₹). */
export const revenueHistory = (() => {
  const vals = [52400, 58100, 56300, 66900, 74200, 83500, 91800, 99600, 108300, 119700, 131200]
  const now = new Date()
  return vals.map((v, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (vals.length - i), 1)
    return { label: d.toLocaleDateString('en-IN', { month: 'short' }), year: d.getFullYear(), value: v }
  })
})()
