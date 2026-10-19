import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { revenueHistory, rupee, STATUSES, fmtSlot, parseDay, dayKey } from '../data'
import { PageHead, BookingStatus, Avatar, thisMonth } from './ui'
import { TrendIcon, ArrowRight, Star } from '../components/Icons'

const GREEN = '#0F9D58'
const SUN = '#E8A200'

const short = (n) => (n >= 100000 ? `₹${(n / 100000).toFixed(n >= 1000000 ? 0 : 1)}L` : n >= 1000 ? `₹${Math.round(n / 1000)}k` : `₹${n}`)

export default function Dashboard({ go }) {
  const { bookings, team, categories } = useStore()
  const now = new Date()
  const day = now.getDate()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

  const m = useMemo(() => {
    const month = bookings.filter((b) => thisMonth(b.date) && !b.cancelled)
    const paid = month.filter((b) => b.status >= 5)
    const collected = paid.reduce((a, b) => a + (b.amount || 0), 0)
    const due = bookings.filter((b) => !b.cancelled && b.status === 4).reduce((a, b) => a + (b.amount || 0), 0)
    const projected = Math.round((collected / Math.max(day, 1)) * daysInMonth)
    const last = revenueHistory[revenueHistory.length - 1].value
    const pace = Math.round(last * (day / daysInMonth))
    const growth = pace ? ((collected - pace) / pace) * 100 : 0
    const upi = paid.filter((b) => b.pay === 'upi').reduce((a, b) => a + b.amount, 0)
    const byCat = categories.map((c) => {
      const list = month.filter((b) => b.cat === c.id)
      return { id: c.id, name: c.name, emoji: c.emoji, count: list.length, revenue: list.filter((b) => b.status >= 5).reduce((a, b) => a + (b.amount || 0), 0) }
    }).sort((a, b) => b.count - a.count)
    const pipeline = STATUSES.map((s, i) => bookings.filter((b) => !b.cancelled && b.status === i && (i < 5 || b.date === dayKey(now))).length)
    const today = dayKey(now)
    const upcoming = bookings
      .filter((b) => !b.cancelled && b.status < 4 && b.date >= today)
      .sort((a, b) => (a.date + String(a.hour).padStart(2, '0')).localeCompare(b.date + String(b.hour).padStart(2, '0')))
      .slice(0, 6)
    const workers = team.map((w) => {
      const list = month.filter((b) => b.proId === w.id)
      return { ...w, monthJobs: list.length, monthRev: list.filter((b) => b.status >= 5).reduce((a, b) => a + (b.amount || 0), 0) }
    }).sort((a, b) => b.monthRev - a.monthRev)
    return { month, collected, due, projected, growth, upi, cash: collected - upi, byCat, pipeline, upcoming, workers }
  }, [bookings, team, categories, day, daysInMonth])

  const monthName = now.toLocaleDateString('en-IN', { month: 'long' })

  return (
    <>
      <PageHead title={`Good ${now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'}, Admin 👋`} sub={`Here’s how Workers Spot is doing in ${monthName}.`}>
        <button className="btn btn--outline btn--sm" onClick={() => go('/admin/bookings')}>All bookings</button>
        <button className="btn btn--primary btn--sm" onClick={() => go('/admin/jobs')}>+ New job posting</button>
      </PageHead>

      <div className="a-kpis">
        <div className="a-kpi a-kpi--hero">
          <small>Revenue collected · {monthName} so far</small>
          <b>{rupee(m.collected)}</b>
          <span className={`a-delta ${m.growth >= 0 ? 'is-up' : 'is-down'}`}><TrendIcon size={14} /> {m.growth >= 0 ? '+' : ''}{m.growth.toFixed(1)}% vs last month’s pace</span>
        </div>
        <div className="a-kpi">
          <small>Bookings this month</small>
          <b>{m.month.length}</b>
          <span>{m.month.filter((b) => b.status >= 5).length} completed & paid</span>
        </div>
        <div className="a-kpi">
          <small>Payments due</small>
          <b>{rupee(m.due)}</b>
          <span>{bookings.filter((b) => !b.cancelled && b.status === 4).length} jobs done, not yet paid</span>
        </div>
        <div className="a-kpi">
          <small>Team rating</small>
          <b>{(team.reduce((a, w) => a + w.rating, 0) / team.length).toFixed(2)} <Star size={20} color="#FFB800" /></b>
          <span>{team.filter((w) => w.available).length} of {team.length} workers free today</span>
        </div>
      </div>

      <div className="a-grid a-grid--2-1">
        <section className="a-card">
          <div className="a-card__head">
            <div>
              <h3>Monthly revenue</h3>
              <p>Last 12 months · projected {rupee(m.projected)} for {monthName}</p>
            </div>
            <div className="a-legend">
              <span><i style={{ background: GREEN }} /> Collected</span>
              <span><i className="a-legend__proj" /> Projected</span>
            </div>
          </div>
          <RevenueChart current={{ label: now.toLocaleDateString('en-IN', { month: 'short' }), year: now.getFullYear(), value: m.collected, projected: m.projected }} />
        </section>

        <section className="a-card">
          <div className="a-card__head"><div><h3>Payment methods</h3><p>Collected in {monthName}</p></div></div>
          <PaymentSplit upi={m.upi} cash={m.cash} />
          <div className="a-card__head a-card__head--sub"><div><h3>Today’s pipeline</h3><p>Jobs by stage</p></div></div>
          <div className="a-pipe">
            {STATUSES.map((s, i) => (
              <button key={s.key} className="a-pipe__item" onClick={() => go('/admin/bookings')}>
                <b>{m.pipeline[i]}</b>
                <small>{i === 5 ? 'Paid today' : s.short}</small>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="a-grid a-grid--1-1">
        <section className="a-card">
          <div className="a-card__head"><div><h3>Bookings by category</h3><p>{monthName} · number of bookings</p></div></div>
          <CategoryBars rows={m.byCat} />
        </section>

        <section className="a-card">
          <div className="a-card__head">
            <div><h3>Up next</h3><p>Upcoming & live jobs</p></div>
            <button className="link link--sm" onClick={() => go('/admin/bookings')}>View all <ArrowRight size={14} /></button>
          </div>
          <div className="a-upnext">
            {m.upcoming.map((b) => {
              const w = team.find((t) => t.id === b.proId)
              const d = parseDay(b.date)
              return (
                <div key={b.id} className="a-upnext__row">
                  <div className="a-upnext__when">
                    <b>{d.getDate()}</b>
                    <small>{d.toLocaleDateString('en-IN', { month: 'short' })}</small>
                  </div>
                  <div className="a-upnext__info">
                    <b>{b.title}</b>
                    <small>{fmtSlot(b.hour)} · {b.name} · {b.address.split(',').slice(-2, -1)[0]?.trim()}</small>
                  </div>
                  {w && <Avatar src={w.image} name={w.name} size={30} />}
                  <BookingStatus b={b} />
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <section className="a-card">
        <div className="a-card__head">
          <div><h3>Worker performance</h3><p>{monthName} so far</p></div>
          <button className="link link--sm" onClick={() => go('/admin/workers')}>Manage workers <ArrowRight size={14} /></button>
        </div>
        <div className="a-table-wrap">
          <table className="a-table">
            <thead><tr><th>Worker</th><th>Role</th><th className="num">Jobs</th><th className="num">Revenue</th><th className="num">Payout</th><th className="num">Rating</th><th>Today</th></tr></thead>
            <tbody>
              {m.workers.map((w) => (
                <tr key={w.id}>
                  <td><div className="a-person"><Avatar src={w.image} name={w.name} /> <b>{w.name}</b></div></td>
                  <td>{w.role}</td>
                  <td className="num">{w.monthJobs}</td>
                  <td className="num">{rupee(w.monthRev)}</td>
                  <td className="num">{rupee((w.monthRev * w.payout) / 100)}</td>
                  <td className="num">{w.rating.toFixed(1)}</td>
                  <td><span className={`chip-status chip-status--${w.available ? 'live' : 'idle'}`}>{w.available ? 'Available' : 'Off / busy'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

/* ───────── Charts ───────── */

function RevenueChart({ current }) {
  const data = [...revenueHistory, current]
  const [hover, setHover] = useState(null)
  const W = 720, H = 260, padL = 52, padB = 28, padT = 12
  const max = Math.max(...data.map((d) => Math.max(d.value, d.projected ?? 0)))
  const step = max > 150000 ? 50000 : 40000
  const top = Math.ceil(max / step) * step
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step)
  const plotW = W - padL - 8
  const bw = plotW / data.length
  const barW = Math.min(30, bw * 0.56)
  const y = (v) => padT + (H - padT - padB) * (1 - v / top)

  return (
    <div className="a-chart" onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Monthly revenue bar chart">
        <defs>
          <pattern id="proj" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#E9F9EF" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#9BD8B5" strokeWidth="2" />
          </pattern>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - 8} y1={y(t)} y2={y(t)} stroke="#EDF1EF" />
            <text x={padL - 10} y={y(t) + 4} textAnchor="end" className="a-axis">{short(t)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = padL + bw * i + bw / 2
          const x = cx - barW / 2
          const isCur = i === data.length - 1
          const r = 4
          const bar = (v, fill, extra = {}) => {
            const top = y(v), h = H - padB - top
            if (h <= 0) return null
            return <path d={`M${x},${H - padB} V${top + r} q0,-${r} ${r},-${r} h${barW - 2 * r} q${r},0 ${r},${r} V${H - padB} Z`} fill={fill} {...extra} />
          }
          return (
            <g key={i} onMouseEnter={() => setHover(i)}>
              <rect x={cx - bw / 2} y={padT} width={bw} height={H - padT - padB} fill={hover === i ? '#F4F7F5' : 'transparent'} />
              {isCur && d.projected > d.value && bar(d.projected, 'url(#proj)', { stroke: '#9BD8B5', strokeDasharray: '3 3' })}
              {bar(d.value, GREEN, { opacity: hover === null || hover === i ? 1 : 0.55 })}
              <text x={cx} y={H - 8} textAnchor="middle" className={`a-axis ${isCur ? 'is-cur' : ''}`}>{d.label}</text>
            </g>
          )
        })}
        {/* direct label on the latest full month */}
        {(() => {
          const i = data.length - 2
          const cx = padL + bw * i + bw / 2
          return <text x={cx} y={y(data[i].value) - 8} textAnchor="middle" className="a-axis a-axis--val">{short(data[i].value)}</text>
        })()}
      </svg>
      {hover !== null && (
        <div className="a-tip" style={{ left: `${((padL + bw * hover + bw / 2) / W) * 100}%` }}>
          <b>{data[hover].label} {data[hover].year}</b>
          <span><i style={{ background: GREEN }} /> Collected <em>{rupee(data[hover].value)}</em></span>
          {data[hover].projected != null && <span><i className="a-legend__proj" /> Projected <em>{rupee(data[hover].projected)}</em></span>}
          {hover > 0 && (
            <small>
              {(((data[hover].value - data[hover - 1].value) / data[hover - 1].value) * 100).toFixed(1)}% vs {data[hover - 1].label}
              {data[hover].projected != null ? ' (month in progress)' : ''}
            </small>
          )}
        </div>
      )}
    </div>
  )
}

function CategoryBars({ rows }) {
  const [hover, setHover] = useState(null)
  const max = Math.max(...rows.map((r) => r.count), 1)
  return (
    <div className="a-hbars" onMouseLeave={() => setHover(null)}>
      {rows.map((r) => (
        <div key={r.id} className={`a-hbar ${hover && hover !== r.id ? 'is-dim' : ''}`} onMouseEnter={() => setHover(r.id)}>
          <span className="a-hbar__label">{r.emoji} {r.name}</span>
          <span className="a-hbar__track">
            <span className="a-hbar__fill" style={{ width: `${(r.count / max) * 100}%` }} />
          </span>
          <span className="a-hbar__val">{r.count}</span>
          {hover === r.id && <span className="a-hbar__tip">{r.count} bookings · {rupee(r.revenue)} collected</span>}
        </div>
      ))}
    </div>
  )
}

function PaymentSplit({ upi, cash }) {
  const total = upi + cash || 1
  const pu = Math.round((upi / total) * 100)
  return (
    <div className="a-split">
      <div className="a-split__bar" role="img" aria-label={`UPI ${pu}%, Cash ${100 - pu}%`}>
        <span style={{ width: `${pu}%`, background: GREEN }} title={`UPI ${rupee(upi)}`} />
        <span style={{ width: `${100 - pu}%`, background: SUN }} title={`Cash ${rupee(cash)}`} />
      </div>
      <div className="a-split__labels">
        <div><i style={{ background: GREEN }} /><span>UPI</span><b>{pu}%</b><small>{rupee(upi)}</small></div>
        <div><i style={{ background: SUN }} /><span>Cash</span><b>{100 - pu}%</b><small>{rupee(cash)}</small></div>
      </div>
    </div>
  )
}
