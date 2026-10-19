import { usePublicCatalog, useStore } from '../store'
import { Logo } from './Icons'

export default function Footer({ onCategory, go }) {
  const { categories } = usePublicCatalog()
  const { settings } = useStore()
  const half = Math.ceil(categories.length / 2)
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Logo light />
          <p className="footer__about">
            Everyday jobs, done by people you can trust. Fixed, hourly or contract pricing, verified pros, and you only pay after the work is done.
          </p>
        </div>
        <div>
          <h4>Services</h4>
          {categories.slice(0, half).map((c) => <button key={c.id} onClick={() => onCategory(c.id)}>{c.name}</button>)}
        </div>
        <div>
          <h4>&nbsp;</h4>
          {categories.slice(half).map((c) => <button key={c.id} onClick={() => onCategory(c.id)}>{c.name}</button>)}
        </div>
        <div>
          <h4>Company</h4>
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
          <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
          <a href="/admin" onClick={(e) => { e.preventDefault(); go('/admin') }}>Admin panel →</a>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© 2026 {settings.businessName} Services Pvt. Ltd.</span>
        <span>{settings.area}, {settings.city} 🌱</span>
      </div>
    </footer>
  )
}
