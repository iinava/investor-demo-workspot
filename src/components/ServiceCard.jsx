import { priceLabel } from '../data'
import { usePublicCatalog } from '../store'
import { Star, ClockIcon } from './Icons'
import PricingBadge from './PricingBadge'

export default function ServiceCard({ s, onBook }) {
  const { categories, pricingTypes } = usePublicCatalog()
  const cat = categories.find((c) => c.id === s.cat)
  return (
    <article className="svc" onClick={() => onBook(s)}>
      <div className="svc__img">
        <img src={s.image} alt={s.title} loading="lazy" />
        <PricingBadge type={s.pricing} floating />
        <span className="svc__price">{priceLabel(s, pricingTypes)}</span>
      </div>
      <div className="svc__body">
        <div className="svc__top">
          <h3>{s.title}</h3>
          <span className="rating"><Star size={12} color="#fff" /> {s.rating}</span>
        </div>
        <p className="svc__meta">{cat?.name} · <ClockIcon size={13} /> {s.duration}</p>
        <button className="btn btn--outline btn--sm" onClick={(e) => { e.stopPropagation(); onBook(s) }}>
          {s.pricing === 'contract' ? 'Get a quote' : 'Book now'}
        </button>
      </div>
    </article>
  )
}
