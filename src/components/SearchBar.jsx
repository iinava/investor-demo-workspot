import { useEffect, useRef, useState } from 'react'
import { searchServices, priceLabel } from '../data'
import { usePublicCatalog, useStore } from '../store'
import { SearchIcon, PinIcon, ArrowRight } from './Icons'

const PLACEHOLDERS = ['leaking tap', 'porter by the hour', 'fan repair', 'deep cleaning', 'house painting contract', 'helper for a day']

export default function SearchBar({ value, onChange, onSearch, onPickService, size = 'hero', autoFocus = false }) {
  const { services, categories, pricingTypes } = usePublicCatalog()
  const { settings } = useStore()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [ph, setPh] = useState(0)
  const wrap = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setPh((p) => (p + 1) % PLACEHOLDERS.length), 2600)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const close = (e) => wrap.current && !wrap.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const q = value.trim().toLowerCase()
  const catHits = q ? categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 2) : categories.slice(0, 4)
  const svcHits = q ? searchServices(services, categories, value).slice(0, 5) : []
  const items = [...catHits.map((c) => ({ kind: 'cat', c })), ...svcHits.map((s) => ({ kind: 'svc', s }))]

  const choose = (it) => {
    setOpen(false)
    if (it.kind === 'cat') onSearch('', it.c.id)
    else onPickService(it.s)
  }

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, items.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)) }
    else if (e.key === 'Escape') setOpen(false)
    else if (e.key === 'Enter' && active >= 0 && open) { e.preventDefault(); choose(items[active]) }
  }

  const submit = (e) => {
    e.preventDefault()
    setOpen(false)
    onSearch(value, null)
  }

  return (
    <div className={`search search--${size}`} ref={wrap}>
      <form className="search__box" onSubmit={submit} role="search">
        <div className="search__loc">
          <PinIcon size={size === 'hero' ? 20 : 18} />
          <span>
            <small>Service in</small>
            {settings.area}
          </span>
        </div>
        <div className="search__field">
          <SearchIcon size={size === 'hero' ? 24 : 20} />
          <input
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(-1) }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKey}
            placeholder={`Try “${PLACEHOLDERS[ph]}”`}
            aria-label="Search for a job"
          />
        </div>
        <button className="search__btn" type="submit">
          <span>Find help</span>
          <ArrowRight size={20} />
        </button>
      </form>

      {open && items.length > 0 && (
        <div className="suggest">
          {!q && <div className="suggest__label">Popular categories</div>}
          {items.map((it, i) =>
            it.kind === 'cat' ? (
              <button key={it.c.id} className={`suggest__row ${active === i ? 'is-active' : ''}`} onMouseDown={() => choose(it)}>
                <img src={it.c.image.replace('w=900', 'w=120')} alt="" />
                <span className="suggest__text">
                  <b>{it.c.name}</b>
                  <small>Category{isFinite(it.c.from) ? ` · from ₹${it.c.from}` : ''}</small>
                </span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button key={it.s.id} className={`suggest__row ${active === i ? 'is-active' : ''}`} onMouseDown={() => choose(it)}>
                <img src={it.s.image.replace('w=700', 'w=120')} alt="" />
                <span className="suggest__text">
                  <b>{it.s.title}</b>
                  <small>{priceLabel(it.s, pricingTypes)} · {it.s.duration}</small>
                </span>
                <span className="suggest__book">{it.s.pricing === 'contract' ? 'Quote' : 'Book'}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
