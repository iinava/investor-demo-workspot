import { useMemo, useState } from 'react'
import { searchServices, workerFor, priceLabel } from '../data'
import { usePublicCatalog } from '../store'
import SearchBar from './SearchBar'
import PricingBadge from './PricingBadge'
import { EmptyIllo } from './Illustrations'
import { Star, ClockIcon, ChevronLeft, ShieldIcon } from './Icons'

const SORTS = { rec: 'Recommended', low: 'Price: low to high', rating: 'Top rated' }
const PRICE_NOTE = { fixed: 'fixed · pay after job', hourly: 'per hour · pay for time used', daily: 'per day · 8 working hrs', contract: 'free site visit · written quote' }

export default function Results({ query, setQuery, cat, pricing, onSearch, onBook, onBack }) {
  const { services, categories, pricingTypes, team } = usePublicCatalog()
  const [sort, setSort] = useState('rec')

  const list = useMemo(() => {
    const r = searchServices(services, categories, query, cat, pricing)
    if (sort === 'low') return [...r].sort((a, b) => a.price - b.price)
    if (sort === 'rating') return [...r].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    return r
  }, [services, categories, query, cat, pricing, sort])

  const catObj = categories.find((c) => c.id === cat)
  const ptObj = pricingTypes.find((p) => p.id === pricing)
  const heading = query.trim() ? `“${query.trim()}”` : catObj ? catObj.name : ptObj ? `${ptObj.name} jobs` : 'All jobs'

  return (
    <main className="results">
      <div className="results__bar">
        <div className="container">
          <SearchBar size="compact" value={query} onChange={setQuery} onSearch={(q, c) => onSearch(q, c, pricing)} onPickService={onBook} />
          <div className="filters">
            <button className={`fchip ${!cat ? 'is-on' : ''}`} onClick={() => onSearch(query, null, pricing)}>All</button>
            {categories.map((c) => (
              <button key={c.id} className={`fchip ${cat === c.id ? 'is-on' : ''}`} onClick={() => onSearch(query, cat === c.id ? null : c.id, pricing)}>
                <span>{c.emoji}</span> {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container results__body">
        <div className="results__head">
          <div>
            <button className="back" onClick={onBack}><ChevronLeft size={18} /> Home</button>
            <h1>{heading}</h1>
            <p>{list.length} {list.length === 1 ? 'job' : 'jobs'} available · see the price before you book</p>
          </div>
          <label className="sort">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>

        <div className="ptoggle" role="group" aria-label="Pricing type">
          <button className={!pricing ? 'is-on' : ''} onClick={() => onSearch(query, cat, null)}>Any pricing</button>
          {pricingTypes.map((p) => (
            <button key={p.id} className={pricing === p.id ? 'is-on' : ''} onClick={() => onSearch(query, cat, pricing === p.id ? null : p.id)}>
              <span>{p.icon}</span> {p.name}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="empty">
            <EmptyIllo />
            <h3>We don’t have that job listed yet</h3>
            <p>Try a simpler word like “tap”, “fan”, “porter” or “clean”, or clear the filters.</p>
            <button className="btn btn--primary" onClick={() => onSearch('', null, null)}>Browse all jobs</button>
          </div>
        ) : (
          <div className="rows">
            {list.map((s) => {
              const pro = workerFor(team, s.cat)
              return (
                <article key={s.id} className="row" onClick={() => onBook(s)}>
                  <div className="row__info">
                    <div className="row__tags">
                      <span className="row__cat">{categories.find((c) => c.id === s.cat)?.name}</span>
                      <PricingBadge type={s.pricing} />
                    </div>
                    <h3>{s.title}</h3>
                    <div className="row__meta">
                      <span className="rating"><Star size={12} color="#fff" /> {s.rating}</span>
                      <span>{s.reviews.toLocaleString('en-IN')} reviews</span>
                      <span><ClockIcon size={14} /> {s.duration}</span>
                    </div>
                    <div className="row__price">{priceLabel(s, pricingTypes)} <small>{PRICE_NOTE[s.pricing]}</small></div>
                    <div className="row__pro">
                      <img src={pro.image} alt="" />
                      <span>Done by <b>{pro.name.split(' ')[0]}</b> or a team member</span>
                      <ShieldIcon size={14} />
                    </div>
                  </div>
                  <div className="row__media">
                    <img src={s.image} alt={s.title} loading="lazy" />
                    <button className="row__add" onClick={(e) => { e.stopPropagation(); onBook(s) }}>{s.pricing === 'contract' ? 'QUOTE' : 'BOOK'}</button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
