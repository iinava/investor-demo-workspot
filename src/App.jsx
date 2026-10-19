import { useCallback, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Results from './components/Results'
import Track from './components/Track'
import BookingSheet from './components/BookingSheet'
import BookingsDrawer from './components/BookingsDrawer'
import Footer from './components/Footer'
import { useStore } from './store'

export default function App({ path, go }) {
  const { bookings, settings } = useStore()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState(null)
  const [pricing, setPricing] = useState(null)
  const [booking, setBooking] = useState(null)
  const [drawer, setDrawer] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const view = path.startsWith('/track/') ? 'track' : path === '/search' ? 'results' : 'home'
  const trackId = view === 'track' ? decodeURIComponent(path.slice(7)) : null

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => { document.title = `${settings.businessName} — Trusted help for everyday jobs` }, [settings.businessName])

  const search = useCallback((q, c, p = null) => {
    setQuery(q)
    setCat(c)
    setPricing(p)
    go('/search')
  }, [go])

  const goHome = () => {
    setQuery('')
    setCat(null)
    setPricing(null)
    go('/')
  }

  const closeBooking = useCallback(() => setBooking(null), [])
  const track = (id) => { setBooking(null); setDrawer(false); go(`/track/${id}`) }

  const activeCount = bookings.filter((b) => b.mine && !b.cancelled && b.status < 5).length

  return (
    <>
      <Navbar onHome={goHome} onBookings={() => setDrawer(true)} bookingCount={activeCount} scrolled={scrolled || view !== 'home'} />

      {view === 'home' && <Home query={query} setQuery={setQuery} onSearch={search} onBook={setBooking} />}
      {view === 'results' && (
        <Results query={query} setQuery={setQuery} cat={cat} pricing={pricing} onSearch={search} onBook={setBooking} onBack={goHome} />
      )}
      {view === 'track' && <Track id={trackId} onBack={() => setDrawer(true)} onBookAgain={setBooking} />}

      <Footer onCategory={(c) => search('', c)} go={go} />

      {booking && <BookingSheet key={booking.id} service={booking} onClose={closeBooking} onTrack={track} />}
      {drawer && <BookingsDrawer onClose={() => setDrawer(false)} onOpen={track} onBrowse={() => { setDrawer(false); search('', null) }} />}
    </>
  )
}
