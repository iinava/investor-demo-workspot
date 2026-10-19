import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultCategories, defaultPricingTypes, defaultServices, defaultSettings, defaultTeam, seedBookings, STATUSES } from './data'

// One shared demo database for the customer site and /admin.
// Persisted to localStorage and synced across tabs, so an admin change
// (price, worker, booking status) shows up live on the customer site.
const KEY = 'workers-spot-demo-v1'

const fresh = () => ({
  services: defaultServices,
  categories: defaultCategories,
  pricingTypes: defaultPricingTypes,
  team: defaultTeam,
  settings: defaultSettings,
  bookings: seedBookings(defaultServices, defaultTeam),
})

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...fresh(), ...JSON.parse(raw) }
  } catch { /* storage unavailable — fall back to defaults */ }
  return fresh()
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [db, setDb] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(db)) } catch { /* ignore */ }
  }, [db])

  useEffect(() => {
    const on = (e) => {
      if (e.key !== KEY || !e.newValue) return
      try { setDb(JSON.parse(e.newValue)) } catch { /* ignore */ }
    }
    window.addEventListener('storage', on)
    return () => window.removeEventListener('storage', on)
  }, [])

  const upsert = useCallback((coll, item) =>
    setDb((d) => {
      const list = d[coll]
      const exists = list.some((x) => x.id === item.id)
      return { ...d, [coll]: exists ? list.map((x) => (x.id === item.id ? { ...x, ...item } : x)) : [item, ...list] }
    }), [])

  const remove = useCallback((coll, id) => setDb((d) => ({ ...d, [coll]: d[coll].filter((x) => x.id !== id) })), [])

  const setStatus = useCallback((id, status) =>
    setDb((d) => ({
      ...d,
      bookings: d.bookings.map((b) => {
        if (b.id !== id) return b
        const events = { ...b.events }
        const now = new Date().toISOString()
        STATUSES.forEach((s, i) => {
          if (i <= status && !events[s.key]) events[s.key] = now
          if (i > status) delete events[s.key]
        })
        return { ...b, status, events, cancelled: false }
      }),
    })), [])

  const api = useMemo(() => ({
    ...db,
    addBooking: (b) => setDb((d) => ({ ...d, bookings: [b, ...d.bookings] })),
    updateBooking: (b) => upsert('bookings', b),
    setStatus,
    cancelBooking: (id) => setDb((d) => ({ ...d, bookings: d.bookings.map((b) => (b.id === id ? { ...b, cancelled: true } : b)) })),
    saveService: (s) => upsert('services', s),
    removeService: (id) => remove('services', id),
    saveCategory: (c) => upsert('categories', c),
    removeCategory: (id) => remove('categories', id),
    savePricingType: (p) => upsert('pricingTypes', p),
    saveWorker: (w) => upsert('team', w),
    removeWorker: (id) => remove('team', id),
    saveSettings: (s) => setDb((d) => ({ ...d, settings: { ...d.settings, ...s } })),
    reset: () => setDb(fresh()),
  }), [db, upsert, remove, setStatus])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)

/* Customer-facing view: only active jobs in active categories with active pricing types. */
export const usePublicCatalog = () => {
  const { services, categories, pricingTypes, team } = useStore()
  return useMemo(() => {
    const cats = categories.filter((c) => c.active)
    const types = pricingTypes.filter((p) => p.active)
    const svcs = services.filter((s) => s.active && cats.some((c) => c.id === s.cat) && types.some((p) => p.id === s.pricing))
    const withFrom = cats.map((c) => ({ ...c, from: Math.min(...svcs.filter((s) => s.cat === c.id).map((s) => s.price), Infinity) }))
    return { services: svcs, categories: withFrom, pricingTypes: types, team }
  }, [services, categories, pricingTypes, team])
}

/* Tiny path router (no dependency needed for a demo). */
export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const on = () => setPath(window.location.pathname)
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])
  const go = useCallback((to) => {
    if (to === window.location.pathname) return
    window.history.pushState(null, '', to)
    setPath(to)
    window.scrollTo({ top: 0 })
  }, [])
  return [path, go]
}
