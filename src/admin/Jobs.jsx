import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { priceLabel, defaultServices } from '../data'
import PricingBadge from '../components/PricingBadge'
import { PageHead, Modal, Toggle, Field, useToast } from './ui'
import { SearchIcon, EditIcon, TrashIcon, PlusIcon, Star } from '../components/Icons'

const IMAGES = [...new Set(defaultServices.map((s) => s.image))]

export default function Jobs() {
  const { services, categories, pricingTypes, bookings, saveService, removeService } = useStore()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [pt, setPt] = useState('')
  const [edit, setEdit] = useState(null)

  const list = useMemo(() => services
    .filter((s) => !cat || s.cat === cat)
    .filter((s) => !pt || s.pricing === pt)
    .filter((s) => !q.trim() || s.title.toLowerCase().includes(q.trim().toLowerCase())), [services, cat, pt, q])

  const booked = (id) => bookings.filter((b) => b.serviceId === id && !b.cancelled).length

  const blank = () => ({ id: 's' + Date.now(), cat: categories[0]?.id, title: '', pricing: 'fixed', price: 299, duration: '1 hr', rating: 5, reviews: 0, image: IMAGES[0], tags: [], active: true, minUnits: 1, isNew: true })

  return (
    <>
      <PageHead title="Job postings" sub="Everything customers can book. Changes go live on the website immediately.">
        <button className="btn btn--primary btn--sm" onClick={() => setEdit(blank())}><PlusIcon size={16} /> Add job</button>
      </PageHead>

      <div className="a-card a-card--flush">
        <div className="a-toolbar">
          <label className="a-search">
            <SearchIcon size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs…" />
          </label>
          <select className="a-select" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
          <select className="a-select" value={pt} onChange={(e) => setPt(e.target.value)}>
            <option value="">All pricing types</option>
            {pricingTypes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="a-table-wrap">
          <table className="a-table">
            <thead><tr><th>Job</th><th>Category</th><th>Pricing</th><th className="num">Rate</th><th>Duration</th><th className="num">Rating</th><th className="num">Bookings</th><th>Live</th><th /></tr></thead>
            <tbody>
              {list.map((s) => {
                const c = categories.find((x) => x.id === s.cat)
                return (
                  <tr key={s.id} className={s.active ? '' : 'is-off'}>
                    <td><div className="a-jobcell"><img src={s.image.replace('w=700', 'w=120')} alt="" /><b>{s.title}</b></div></td>
                    <td>{c ? `${c.emoji} ${c.name}` : '—'}</td>
                    <td><PricingBadge type={s.pricing} /></td>
                    <td className="num"><b>{priceLabel(s, pricingTypes)}</b></td>
                    <td>{s.duration}</td>
                    <td className="num"><span className="a-rating"><Star size={12} color="#FFB800" /> {s.rating}</span></td>
                    <td className="num">{booked(s.id)}</td>
                    <td><Toggle on={s.active} label={`${s.title} live`} onChange={(v) => { saveService({ id: s.id, active: v }); toast(v ? `“${s.title}” is live` : `“${s.title}” hidden from site`) }} /></td>
                    <td className="a-actions">
                      <button className="a-icon" onClick={() => setEdit(s)} aria-label="Edit"><EditIcon size={16} /></button>
                      <button className="a-icon a-danger" onClick={() => { if (confirm(`Delete “${s.title}”?`)) { removeService(s.id); toast('Job deleted') } }} aria-label="Delete"><TrashIcon size={16} /></button>
                    </td>
                  </tr>
                )
              })}
              {list.length === 0 && <tr><td colSpan={9} className="a-empty">No jobs match.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {edit && (
        <JobForm
          job={edit}
          categories={categories}
          pricingTypes={pricingTypes}
          onClose={() => setEdit(null)}
          onSave={(j) => { const { isNew, ...rest } = j; saveService(rest); toast(isNew ? 'Job posted — it’s live on the site' : 'Job updated'); setEdit(null) }}
        />
      )}
    </>
  )
}

function JobForm({ job, categories, pricingTypes, onClose, onSave }) {
  const [j, setJ] = useState({ ...job, tagsText: job.tags.join(', ') })
  const set = (k) => (e) => setJ((x) => ({ ...x, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))
  const pt = pricingTypes.find((p) => p.id === j.pricing)
  const ok = j.title.trim().length > 2 && j.price > 0

  return (
    <Modal
      title={job.isNew ? 'New job posting' : 'Edit job'}
      onClose={onClose}
      wide
      footer={<>
        <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn--primary" disabled={!ok} onClick={() => onSave({ ...j, tags: j.tagsText.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean), tagsText: undefined })}>
          {job.isNew ? 'Publish job' : 'Save changes'}
        </button>
      </>}
    >
      <div className="a-form">
        <Field label="Job title" full><input value={j.title} onChange={set('title')} placeholder="e.g. Geyser installation" /></Field>
        <Field label="Category">
          <select value={j.cat} onChange={set('cat')}>{categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}</select>
        </Field>
        <Field label="Duration shown to customers"><input value={j.duration} onChange={set('duration')} placeholder="e.g. 1–2 hrs" /></Field>

        <div className="a-field a-field--full">
          <span>Pricing type</span>
          <div className="a-ptpick">
            {pricingTypes.map((p) => (
              <button type="button" key={p.id} className={j.pricing === p.id ? 'is-on' : ''} onClick={() => setJ((x) => ({ ...x, pricing: p.id }))}>
                <span>{p.icon}</span><b>{p.name}</b><small>{p.desc}</small>
              </button>
            ))}
          </div>
        </div>

        <Field label={j.pricing === 'contract' ? 'Starting price (₹)' : `Rate (₹${pt?.unit || ' per job'})`}>
          <input type="number" min="0" value={j.price} onChange={set('price')} />
        </Field>
        {(j.pricing === 'hourly' || j.pricing === 'daily') ? (
          <Field label={`Minimum ${pt?.unitLabel}s`}><input type="number" min="1" max="8" value={j.minUnits} onChange={set('minUnits')} /></Field>
        ) : <div />}

        <Field label="Search keywords" hint="Comma separated — helps customers find this job" full>
          <input value={j.tagsText} onChange={set('tagsText')} placeholder="geyser, water heater, install" />
        </Field>

        <div className="a-field a-field--full">
          <span>Photo</span>
          <div className="a-imgpick">
            {IMAGES.map((src) => (
              <button type="button" key={src} className={j.image === src ? 'is-on' : ''} onClick={() => setJ((x) => ({ ...x, image: src }))}>
                <img src={src.replace('w=700', 'w=160')} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="a-preview a-field--full">
          <img src={j.image} alt="" />
          <div>
            <small>Preview on site</small>
            <b>{j.title || 'Job title'}</b>
            <span><PricingBadge type={j.pricing} /> {priceLabel(j, pricingTypes)} · {j.duration}</span>
          </div>
          <label className="a-preview__live"><Toggle on={j.active} onChange={(v) => setJ((x) => ({ ...x, active: v }))} label="Live" /> Live</label>
        </div>
      </div>
    </Modal>
  )
}

