import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { STATUSES, rupee, fmtSlot, parseDay, dayKey } from '../data'
import PricingBadge from '../components/PricingBadge'
import { PageHead, Panel, BookingStatus, Avatar, Pager, Field, useToast } from './ui'
import { SearchIcon, CheckIcon, PhoneIcon, HomeIcon } from '../components/Icons'

const TABS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'upcoming', label: 'Upcoming', test: (b) => !b.cancelled && b.status <= 1 },
  { id: 'live', label: 'Live now', test: (b) => !b.cancelled && (b.status === 2 || b.status === 3) },
  { id: 'due', label: 'Payment due', test: (b) => !b.cancelled && b.status === 4 },
  { id: 'paid', label: 'Paid', test: (b) => !b.cancelled && b.status >= 5 },
  { id: 'cancelled', label: 'Cancelled', test: (b) => b.cancelled },
]
const PER = 14

export default function Bookings() {
  const { bookings, team } = useStore()
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const [worker, setWorker] = useState('')
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(null)

  const list = useMemo(() => {
    const t = TABS.find((x) => x.id === tab)
    const s = q.trim().toLowerCase()
    return bookings
      .filter(t.test)
      .filter((b) => !worker || b.proId === worker)
      .filter((b) => !s || `${b.id} ${b.name} ${b.title} ${b.phone} ${b.address}`.toLowerCase().includes(s))
      .sort((a, b) => (b.date + String(b.hour).padStart(2, '0')).localeCompare(a.date + String(a.hour).padStart(2, '0')))
  }, [bookings, tab, q, worker])

  const pages = Math.ceil(list.length / PER)
  const rows = list.slice(page * PER, page * PER + PER)
  const counts = Object.fromEntries(TABS.map((t) => [t.id, bookings.filter(t.test).length]))
  const today = dayKey(new Date())

  return (
    <>
      <PageHead title="Bookings & orders" sub="Every job booked on the site. Click a row to update its status, reassign a worker or record payment." />

      <div className="a-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'is-on' : ''} onClick={() => { setTab(t.id); setPage(0) }}>
            {t.label} <em>{counts[t.id]}</em>
          </button>
        ))}
      </div>

      <div className="a-card a-card--flush">
        <div className="a-toolbar">
          <label className="a-search">
            <SearchIcon size={16} />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0) }} placeholder="Search by ID, customer, job, phone…" />
          </label>
          <select className="a-select" value={worker} onChange={(e) => { setWorker(e.target.value); setPage(0) }}>
            <option value="">All workers</option>
            {team.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>
        <div className="a-table-wrap">
          <table className="a-table a-table--click">
            <thead>
              <tr><th>Booking</th><th>Customer</th><th>Job</th><th>When</th><th>Worker</th><th className="num">Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rows.map((b) => {
                const w = team.find((t) => t.id === b.proId)
                return (
                  <tr key={b.id} onClick={() => setOpen(b.id)}>
                    <td><b className="a-mono">#{b.id}</b>{b.mine && <span className="a-tag">demo customer</span>}</td>
                    <td><b>{b.name}</b><small>+91 {b.phone}</small></td>
                    <td><span className="a-job">{b.title}</span><PricingBadge type={b.pricing} /></td>
                    <td>{b.date === today ? <b>Today</b> : parseDay(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}<small>{fmtSlot(b.hour)}</small></td>
                    <td>{w && <div className="a-person"><Avatar src={w.image} name={w.name} size={26} /> {w.name.split(' ')[0]}</div>}</td>
                    <td className="num">{b.amount != null ? rupee(b.amount) : <span className="a-muted">Quote pending</span>}</td>
                    <td><BookingStatus b={b} /></td>
                  </tr>
                )
              })}
              {rows.length === 0 && <tr><td colSpan={7} className="a-empty">No bookings match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pager page={page} pages={pages} setPage={setPage} total={list.length} label="bookings" />
      </div>

      {open && <BookingPanel id={open} onClose={() => setOpen(null)} />}
    </>
  )
}

function BookingPanel({ id, onClose }) {
  const { bookings, team, setStatus, updateBooking, cancelBooking } = useStore()
  const toast = useToast()
  const b = bookings.find((x) => x.id === id)
  const [quote, setQuote] = useState(b?.amount ?? '')
  if (!b) return null
  const w = team.find((t) => t.id === b.proId)
  const qualified = team.filter((t) => t.skills.includes(b.cat))
  const others = team.filter((t) => !t.skills.includes(b.cat))

  const move = (i) => { setStatus(b.id, i); toast(`#${b.id} → ${STATUSES[i].label}`) }

  return (
    <Panel title={`Booking #${b.id}`} onClose={onClose}>
      <div className="a-pbody">
        <div className="a-pbody__head">
          <div>
            <h3>{b.title}</h3>
            <p><PricingBadge type={b.pricing} /> {parseDay(b.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {fmtSlot(b.hour)}</p>
          </div>
          <BookingStatus b={b} />
        </div>

        <h4>Update status</h4>
        <div className="a-steps">
          {STATUSES.map((s, i) => (
            <button key={s.key} className={`${!b.cancelled && i <= b.status ? 'is-done' : ''} ${!b.cancelled && i === b.status ? 'is-now' : ''}`} onClick={() => move(i)}>
              <span>{!b.cancelled && i < b.status ? <CheckIcon size={12} /> : i + 1}</span>
              {s.short}
              {b.events?.[s.key] && <small>{new Date(b.events[s.key]).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</small>}
            </button>
          ))}
        </div>
        <p className="a-hint">The customer’s tracking page updates instantly, even in another tab.</p>

        {b.pricing === 'contract' && (
          <>
            <h4>Contract quote</h4>
            <div className="a-inline">
              <Field label="Quoted amount (₹)">
                <input type="number" min="0" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="e.g. 18500" />
              </Field>
              <button className="btn btn--primary btn--sm" onClick={() => { updateBooking({ id: b.id, amount: Number(quote) || null }); toast('Quote saved and shared with customer') }}>Save quote</button>
            </div>
          </>
        )}

        <h4>Assigned worker</h4>
        <div className="a-assign">
          {w && <Avatar src={w.image} name={w.name} size={44} />}
          <select className="a-select" value={b.proId} onChange={(e) => { updateBooking({ id: b.id, proId: e.target.value }); toast('Worker reassigned') }}>
            <optgroup label="Skilled for this job">{qualified.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.role}{t.available ? '' : ' (busy)'}</option>)}</optgroup>
            {others.length > 0 && <optgroup label="Others">{others.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.role}</option>)}</optgroup>}
          </select>
        </div>

        <h4>Customer</h4>
        <div className="a-kv">
          <div><span>Name</span><b>{b.name}</b></div>
          <div><span><PhoneIcon size={14} /></span><b>+91 {b.phone}</b></div>
          <div><span><HomeIcon size={14} /></span><b>{b.address}</b></div>
          {b.note && <div><span>Note</span><b>{b.note}</b></div>}
          <div><span>OTP</span><b className="a-mono">{b.otp}</b></div>
        </div>

        <h4>Payment</h4>
        <div className="a-kv">
          <div><span>Amount</span><b>{b.amount != null ? rupee(b.amount) : 'Quote pending'}{(b.pricing === 'hourly' || b.pricing === 'daily') && ` (${rupee(b.rate)} × ${b.units})`}</b></div>
          <div><span>Method</span><b>{b.pay === 'upi' ? 'UPI' : 'Cash'}</b></div>
          <div><span>Status</span><b>{b.cancelled ? 'Cancelled' : b.status >= 5 ? '✓ Paid' : b.status === 4 ? 'Due' : 'After job'}</b></div>
          {w && b.amount != null && <div><span>Payout</span><b>{rupee((b.amount * w.payout) / 100)} to {w.name.split(' ')[0]} ({w.payout}%)</b></div>}
        </div>

        <div className="a-pbody__actions">
          {!b.cancelled && b.status === 4 && <button className="btn btn--primary btn--sm" onClick={() => move(5)}>Mark as paid</button>}
          {!b.cancelled && b.status < 4 && <button className="btn btn--ghost btn--sm a-danger" onClick={() => { cancelBooking(b.id); toast(`#${b.id} cancelled`) }}>Cancel booking</button>}
          {b.cancelled && <button className="btn btn--outline btn--sm" onClick={() => move(1)}>Restore booking</button>}
        </div>
      </div>
    </Panel>
  )
}
