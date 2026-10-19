import { useEffect, useState } from 'react'
import { STATUSES, rupee, fmtSlot, parseDay, dayKey, priceLabel } from '../data'
import { useStore } from '../store'
import PricingBadge from './PricingBadge'
import { ChevronLeft, PhoneIcon, Star, CheckIcon, ShieldIcon, CalendarIcon, HomeIcon, WalletIcon, KeyIcon, ClockIcon, ArrowRight } from './Icons'

const fmtTime = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
const fmtDay = (d) => {
  const now = new Date()
  const k = dayKey(d)
  if (k === dayKey(now)) return 'Today'
  if (k === dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))) return 'Tomorrow'
  if (k === dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
const stamp = (iso) => `${fmtDay(new Date(iso))}, ${fmtTime(iso)}`

export default function Track({ id, onBack, onBookAgain }) {
  const { bookings, team, services, pricingTypes, setStatus, cancelBooking } = useStore()
  const b = bookings.find((x) => x.id === id)
  const [eta, setEta] = useState(12)
  const [rated, setRated] = useState(0)

  useEffect(() => {
    if (b?.status !== 2) return
    setEta(12)
    const t = setInterval(() => setEta((e) => Math.max(1, e - 1)), 4000)
    return () => clearInterval(t)
  }, [b?.status])

  if (!b) {
    return (
      <main className="track container">
        <button className="back" onClick={onBack}><ChevronLeft size={18} /> Back</button>
        <h1>Booking not found</h1>
      </main>
    )
  }

  const pro = team.find((m) => m.id === b.proId) ?? team[0]
  const svc = services.find((s) => s.id === b.serviceId)
  const first = pro.name.split(' ')[0]
  const slotDate = parseDay(b.date)
  slotDate.setHours(b.hour)
  const st = b.status
  const isContract = b.pricing === 'contract'
  const amountText = b.amount != null ? rupee(b.amount) : 'Quote pending'
  const unitLabel = pricingTypes.find((p) => p.id === b.pricing)?.unitLabel ?? ''

  const expected = [null, null, new Date(slotDate.getTime() - 35 * 60e3), slotDate, new Date(slotDate.getTime() + 95 * 60e3), null]

  const head = b.cancelled
    ? { t: 'Booking cancelled', s: 'No charges were made. Book again anytime.', tone: 'muted' }
    : [
        { t: 'Booking received', s: 'Finding the best pro for your job…', tone: 'dark' },
        { t: `${first} is assigned`, s: `Arriving ${fmtDay(slotDate)} at ${fmtSlot(b.hour)}`, tone: 'dark' },
        { t: `${first} is on the way`, s: `Arriving in about ${eta} min`, tone: 'green' },
        { t: isContract ? 'Site inspection in progress' : 'Work in progress', s: `${first} started at ${fmtTime(b.events.started ?? new Date().toISOString())}`, tone: 'green' },
        { t: 'Job completed', s: b.amount != null ? `Please check the work and pay ${amountText}` : 'Your written quote is on the way', tone: 'sun' },
        { t: 'Paid & all done', s: `Thanks for choosing Workers Spot!`, tone: 'paid' },
      ][st]

  const next = () => setStatus(b.id, Math.min(st + 1, 5))

  return (
    <main className="track">
      <div className="container">
        <button className="back" onClick={onBack}><ChevronLeft size={18} /> My bookings</button>

        {/* STATUS CARD */}
        <section className={`tstatus tstatus--${head.tone}`}>
          <div className="tstatus__copy">
            <span className="tstatus__id">Booking #{b.id} · {b.title}</span>
            <h1>{head.t}</h1>
            <p>{head.s}</p>
            {!b.cancelled && (
              <div className="tprog" aria-label={`Step ${st + 1} of ${STATUSES.length}`}>
                {STATUSES.map((s, i) => (
                  <span key={s.key} className={`tprog__seg ${i <= st ? 'is-done' : ''} ${i === st ? 'is-now' : ''}`}>
                    <i />
                    <small>{s.short}</small>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="tstatus__art">
            {st === 2 && !b.cancelled ? (
              <div className="tmap" aria-hidden="true">
                <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
                  <rect width="300" height="200" fill="#E9F1EC" />
                  <path d="M0 60h300M0 140h300M80 0v200M210 0v200" stroke="#fff" strokeWidth="14" />
                  <path d="M0 100h300M140 0v200" stroke="#fff" strokeWidth="7" />
                  <rect x="96" y="76" width="34" height="50" rx="6" fill="#D5E6DB" />
                  <rect x="226" y="20" width="60" height="28" rx="6" fill="#D5E6DB" />
                  <rect x="20" y="156" width="46" height="34" rx="6" fill="#FFE7B0" />
                  <path id="route" d="M30 180 L80 140 L80 100 L140 100 L140 60 L250 60" fill="none" stroke="#0F9D58" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 10" />
                  <circle cx="250" cy="60" r="16" fill="#0F9D58" opacity=".18" />
                  <circle cx="250" cy="60" r="9" fill="#0C2A1F" />
                  <circle cx="250" cy="60" r="4" fill="#FFC93C" />
                  <g className="tmap__rider">
                    <circle r="13" fill="#fff" stroke="#0F9D58" strokeWidth="3" />
                    <text y="5" textAnchor="middle" fontSize="13">🛵</text>
                    <animateMotion dur="9s" repeatCount="indefinite" keyPoints="0;0.85" keyTimes="0;1" calcMode="linear">
                      <mpath href="#route" />
                    </animateMotion>
                  </g>
                </svg>
                <span className="tmap__eta"><b>{eta} min</b> away</span>
              </div>
            ) : (
              <div className={`tbadge tbadge--${head.tone}`}>
                {b.cancelled ? '✕' : st >= 5 ? <CheckIcon size={54} /> : st === 4 ? '🧾' : st === 3 ? '🛠️' : st === 1 ? '👷' : '📋'}
              </div>
            )}
          </div>
        </section>

        <div className="tgrid">
          {/* TIMELINE */}
          <section className="tcard">
            <h3>Timeline</h3>
            <ol className="tline">
              {STATUSES.map((s, i) => {
                const done = !b.cancelled && i <= st
                const now = !b.cancelled && i === st
                const at = b.events?.[s.key]
                const exp = expected[i]
                return (
                  <li key={s.key} className={`tline__item ${done ? 'is-done' : ''} ${now ? 'is-now' : ''}`}>
                    <span className="tline__dot">{done && !now ? <CheckIcon size={14} /> : null}</span>
                    <div>
                      <b>{s.key === 'enroute' ? `${first} is on the way` : s.key === 'assigned' ? `${first} assigned` : s.label}</b>
                      <small>
                        {at ? stamp(at) : exp && !b.cancelled ? `Expected ${stamp(exp.toISOString())}` : b.cancelled ? '—' : 'Pending'}
                      </small>
                      {now && <p>{s.key === 'started' && isContract ? 'Measuring the site and preparing your quote.' : s.desc}</p>}
                    </div>
                  </li>
                )
              })}
              {b.cancelled && (
                <li className="tline__item is-cancel">
                  <span className="tline__dot">✕</span>
                  <div><b>Cancelled</b><small>No charges made</small></div>
                </li>
              )}
            </ol>
          </section>

          <div className="tside">
            {/* PRO */}
            <section className="tcard tpro">
              <img src={pro.image} alt="" />
              <div>
                <small>Your pro</small>
                <b>{pro.name}</b>
                <span><Star size={12} color="#FFB800" /> {pro.rating} · {pro.jobs.toLocaleString('en-IN')} jobs · Verified</span>
              </div>
              <a className="tpro__call" href={`tel:+91${pro.phone.replace(/\s/g, '')}`} aria-label={`Call ${pro.name}`}><PhoneIcon size={18} /></a>
            </section>

            {/* OTP */}
            {!b.cancelled && st < 3 && (
              <section className="tcard totp">
                <KeyIcon size={20} />
                <div>
                  <small>Share this OTP when {first} arrives</small>
                  <b>{b.otp.split('').join(' ')}</b>
                </div>
              </section>
            )}

            {/* PAYMENT */}
            <section className={`tcard tpay ${st >= 5 ? 'is-paid' : ''}`}>
              <div className="tpay__head">
                <h3><WalletIcon size={18} /> Payment</h3>
                <span className={`chip-status chip-status--${b.cancelled ? 'muted' : st >= 5 ? 'good' : st === 4 ? 'warn' : 'idle'}`}>
                  {b.cancelled ? 'Cancelled' : st >= 5 ? '✓ Paid' : st === 4 ? 'Due now' : 'Pay after job'}
                </span>
              </div>
              <div className="tpay__amt">
                <b>{amountText}</b>
                <small>
                  {b.pricing === 'hourly' || b.pricing === 'daily' ? `${rupee(b.rate)} × ${b.units} ${unitLabel}${b.units > 1 ? 's' : ''} · ` : ''}
                  {b.pay === 'upi' ? 'UPI' : 'Cash'}{st >= 5 && b.events.paid ? ` · paid ${stamp(b.events.paid)}` : ''}
                </small>
              </div>
              {!b.cancelled && st === 4 && b.amount != null && (
                <button className="btn btn--primary btn--block" onClick={() => setStatus(b.id, 5)}>
                  Pay {amountText} {b.pay === 'upi' ? 'via UPI' : '— mark cash paid'} <ArrowRight size={16} />
                </button>
              )}
              {st >= 5 && (
                <div className="trate">
                  <span>{rated ? 'Thanks for rating!' : `Rate ${first}`}</span>
                  <div>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setRated(n)} aria-label={`${n} stars`}>
                        <Star size={22} color={n <= rated ? '#FFB800' : '#D9E0DC'} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* DETAILS */}
            <section className="tcard tdetails">
              <h3>Job details</h3>
              <div><span>Job</span><b>{b.title} <PricingBadge type={b.pricing} /></b></div>
              <div><CalendarIcon size={16} /><b>{slotDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {fmtSlot(b.hour)}</b></div>
              {svc && <div><ClockIcon size={16} /><b>{svc.duration}{isContract && ` · ${priceLabel(svc, pricingTypes)}`}</b></div>}
              <div><HomeIcon size={16} /><b>{b.address}</b></div>
              {b.note && <div><span>Note</span><b>{b.note}</b></div>}
              <p><ShieldIcon size={14} /> 7-day re-work guarantee on every job.</p>
              <div className="tdetails__actions">
                {!b.cancelled && st < 3 && <button className="btn btn--ghost btn--sm" onClick={() => cancelBooking(b.id)}>Cancel booking</button>}
                {svc && (st >= 5 || b.cancelled) && <button className="btn btn--outline btn--sm" onClick={() => onBookAgain(svc)}>Book again</button>}
              </div>
            </section>
          </div>
        </div>
      </div>

      {!b.cancelled && st < 5 && (
        <button className="demo-advance" onClick={next} title="Presenter control — simulates the next real-world update">
          <span>Demo</span> Next status: {STATUSES[st + 1].short} <ArrowRight size={14} />
        </button>
      )}
    </main>
  )
}
