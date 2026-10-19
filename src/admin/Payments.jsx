import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { rupee, parseDay } from '../data'
import { PageHead, Avatar, Pager, useToast, thisMonth } from './ui'
import { SearchIcon } from '../components/Icons'

const PER = 15

export default function Payments() {
  const { bookings, team, setStatus } = useStore()
  const toast = useToast()
  const [filter, setFilter] = useState('all')
  const [method, setMethod] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)

  const records = useMemo(() => bookings
    .filter((b) => !b.cancelled && b.status >= 4 && b.amount != null)
    .map((b) => {
      const w = team.find((t) => t.id === b.proId)
      const payout = w ? Math.round((b.amount * w.payout) / 100) : 0
      return { ...b, worker: w, payout, margin: b.amount - payout, paid: b.status >= 5, paidAt: b.events?.paid }
    })
    .sort((a, b) => (b.paidAt ?? b.date).localeCompare(a.paidAt ?? a.date)), [bookings, team])

  const month = records.filter((r) => thisMonth(r.date))
  const sum = (arr, k) => arr.reduce((a, r) => a + r[k], 0)
  const collected = sum(month.filter((r) => r.paid), 'amount')
  const due = sum(records.filter((r) => !r.paid), 'amount')
  const payouts = sum(month.filter((r) => r.paid), 'payout')

  const list = records
    .filter((r) => filter === 'all' || (filter === 'paid' ? r.paid : !r.paid))
    .filter((r) => !method || r.pay === method)
    .filter((r) => !q.trim() || `${r.id} ${r.name} ${r.title}`.toLowerCase().includes(q.trim().toLowerCase()))
  const pages = Math.ceil(list.length / PER)
  const rows = list.slice(page * PER, page * PER + PER)

  return (
    <>
      <PageHead title="Payments" sub="Customers pay after the job by UPI or cash. Track what’s collected, what’s due, and worker payouts.">
        <button className="btn btn--outline btn--sm" onClick={() => toast('Demo: CSV export would download here')}>Export CSV</button>
      </PageHead>

      <div className="a-kpis">
        <div className="a-kpi a-kpi--hero"><small>Collected this month</small><b>{rupee(collected)}</b><span>{month.filter((r) => r.paid).length} payments</span></div>
        <div className="a-kpi"><small>Due from customers</small><b>{rupee(due)}</b><span>{records.filter((r) => !r.paid).length} completed jobs</span></div>
        <div className="a-kpi"><small>Worker payouts (month)</small><b>{rupee(payouts)}</b><span>paid every Monday</span></div>
        <div className="a-kpi"><small>Company margin (month)</small><b>{rupee(collected - payouts)}</b><span>{collected ? Math.round(((collected - payouts) / collected) * 100) : 0}% of revenue</span></div>
      </div>

      <div className="a-card a-card--flush">
        <div className="a-toolbar">
          <div className="a-seg">
            {[['all', 'All'], ['paid', 'Paid'], ['due', 'Due']].map(([k, l]) => (
              <button key={k} className={filter === k ? 'is-on' : ''} onClick={() => { setFilter(k); setPage(0) }}>{l}</button>
            ))}
          </div>
          <select className="a-select" value={method} onChange={(e) => { setMethod(e.target.value); setPage(0) }}>
            <option value="">UPI & cash</option>
            <option value="upi">UPI only</option>
            <option value="cash">Cash only</option>
          </select>
          <label className="a-search">
            <SearchIcon size={16} />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0) }} placeholder="Search payments…" />
          </label>
        </div>
        <div className="a-table-wrap">
          <table className="a-table">
            <thead><tr><th>Booking</th><th>Customer</th><th>Job date</th><th>Method</th><th className="num">Amount</th><th>Worker</th><th className="num">Payout</th><th className="num">Margin</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><b className="a-mono">#{r.id}</b><small>{r.title}</small></td>
                  <td>{r.name}</td>
                  <td>{parseDay(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td><span className={`a-method a-method--${r.pay}`}>{r.pay === 'upi' ? 'UPI' : 'Cash'}</span></td>
                  <td className="num"><b>{rupee(r.amount)}</b></td>
                  <td>{r.worker && <div className="a-person"><Avatar src={r.worker.image} name={r.worker.name} size={24} /> {r.worker.name.split(' ')[0]}</div>}</td>
                  <td className="num">{rupee(r.payout)}</td>
                  <td className="num">{rupee(r.margin)}</td>
                  <td>
                    {r.paid ? <span className="chip-status chip-status--good">✓ Paid</span> : (
                      <button className="a-mini" onClick={() => { setStatus(r.id, 5); toast(`#${r.id} marked as paid`) }}>Mark paid</button>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={9} className="a-empty">No payments match.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pager page={page} pages={pages} setPage={setPage} total={list.length} label="payments" />
      </div>
    </>
  )
}
