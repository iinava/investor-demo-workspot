import { useStore } from '../store'
import { Logo, BagIcon, PhoneIcon } from './Icons'

export default function Navbar({ onHome, onBookings, bookingCount, scrolled }) {
  const { settings } = useStore()
  const nav = (id) => (e) => {
    e.preventDefault()
    onHome()
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60)
  }
  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <button className="nav__brand" onClick={onHome} aria-label="Workers Spot home">
          <Logo />
        </button>
        <nav className="nav__links">
          <a href="#services" onClick={nav('services')}>Services</a>
          <a href="#how" onClick={nav('how')}>How it works</a>
          <a href="#team" onClick={nav('team')}>Our team</a>
        </nav>
        <div className="nav__actions">
          <a className="nav__call" href={`tel:${settings.phone.replace(/\s/g, '')}`}>
            <PhoneIcon size={18} />
            <span>{settings.phone}</span>
          </a>
          <button className="nav__bookings" onClick={onBookings}>
            <BagIcon size={18} />
            <span>My bookings</span>
            {bookingCount > 0 && <em>{bookingCount}</em>}
          </button>
        </div>
      </div>
    </header>
  )
}
