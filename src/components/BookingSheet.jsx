import { useEffect, useMemo, useState } from 'react'
import { workerFor, rupee, priceLabel, amountFor, fmtSlot, dayKey } from '../data'
import { usePublicCatalog, useStore } from '../store'
import PricingBadge from './PricingBadge'
import { CloseIcon, ChevronLeft, CalendarIcon, ClockIcon, HomeIcon, Star, CheckIcon, ShieldIcon, WalletIcon, ArrowRight, PlusIcon, NavIcon } from './Icons'

const STEPS = ['When', 'Where', 'Confirm']

// Deterministic "fully booked" slots so the demo looks lived-in.
const isFull = (date, hour, sid) => {
  const seed = [...`${dayKey(date)}${hour}${sid}`].reduce((a, c) => a + c.charCodeAt(0), 0)
  return seed % 5 === 0
}

export default function BookingSheet({ service, onClose, onTrack }) {
  const { categories, pricingTypes, team } = usePublicCatalog()
  const { settings, addBooking } = useStore()
  const SLOTS = settings.slots
  const [step, setStep] = useState(0)
  const [date, setDate] = useState(null)
  const [hour, setHour] = useState(null)
  const [units, setUnits] = useState(service.minUnits || 1)
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' })
  const [pay, setPay] = useState(settings.upi ? 'upi' : 'cash')
  const [booking, setBooking] = useState(null)

  const cat = categories.find((c) => c.id === service.cat)
  const pt = pricingTypes.find((p) => p.id === service.pricing)
  const pro = workerFor(team, service.cat)
  const isContract = service.pricing === 'contract'
  const hasUnits = service.pricing === 'hourly' || service.pricing === 'daily'
  const amount = amountFor(service, units)
  const maxUnits = service.pricing === 'hourly' ? 8 : 7

  const days = useMemo(() => {
    const t = new Date()
    const start = t.getHours() + 1 >= SLOTS[SLOTS.length - 1] ? 1 : 0
    return Array.from({ length: 7 }, (_, i) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + start + i))
  }, [SLOTS])

  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose])

  const now = new Date()
  const slotState = (h) => {
    if (!date) return 'off'
    if (dayKey(date) === dayKey(now) && h <= now.getHours() + 1) return 'past'
    if (isFull(date, h, service.id)) return 'full'
    return 'open'
  }

  const phoneOk = /^\d{10}$/.test(form.phone.replace(/\D/g, ''))
  const canNext = step === 0 ? date && hour !== null : step === 1 ? form.name.trim() && phoneOk && form.address.trim().length > 5 : true
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const confirm = () => {
    const created = new Date()
    const b = {
      id: 'WS' + Math.floor(50000 + Math.random() * 49999),
      serviceId: service.id, title: service.title, cat: service.cat, pricing: service.pricing,
      rate: service.price, units: hasUnits ? units : 1, amount,
      proId: pro.id, date: dayKey(date), hour, pay,
      name: form.name, phone: form.phone.replace(/\D/g, ''), address: form.address, note: form.note,
      status: 1, cancelled: false, createdAt: created.toISOString(),
      events: { booked: created.toISOString(), assigned: new Date(created.getTime() + 1000).toISOString() },
      otp: String(1000 + Math.floor(Math.random() * 9000)), mine: true,
    }
    addBooking(b)
    setBooking(b)
    setStep(3)
  }

  const dateLabel = (d) =>
    dayKey(d) === dayKey(now) ? 'Today' : dayKey(d) === dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)) ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' })

  const unitWord = (n) => `${n} ${pt?.unitLabel ?? ''}${n > 1 ? 's' : ''}`
  const payableText = isContract ? 'Quote after visit' : rupee(amount)

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={`Book ${service.title}`}>
      <div className="sheet__scrim" onClick={onClose} />
      <div className="sheet__panel">
        {step < 3 && (
          <>
            <div className="sheet__hero">
              <img src={service.image} alt="" />
              <div className="sheet__hero-shade" />
              <button className="sheet__close" onClick={onClose} aria-label="Close"><CloseIcon size={20} /></button>
              <div className="sheet__hero-copy">
                <span>{cat?.emoji} {cat?.name} &nbsp;<PricingBadge type={service.pricing} /></span>
                <h2>{service.title}</h2>
                <p>
                  <b>{priceLabel(service, pricingTypes)}</b> · <ClockIcon size={14} /> {service.duration} · <Star size={13} color="#FFC93C" /> {service.rating} ({service.reviews})
                </p>
              </div>
            </div>

            <div className="stepper">
              {STEPS.map((s, i) => (
                <div key={s} className={`stepper__item ${i === step ? 'is-on' : ''} ${i < step ? 'is-done' : ''}`}>
                  <span>{i < step ? <CheckIcon size={14} /> : i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="sheet__body">
          {step === 0 && (
            <>
              {isContract && (
                <div className="notice">
                  <b>📝 Contract job</b>
                  <span>Pick a time for a <b>free site visit</b>. Our pro will check the work and send a written quote. You only confirm if you agree.</span>
                </div>
              )}

              {hasUnits && (
                <div className="units">
                  <div>
                    <b>How many {pt.unitLabel}s do you need?</b>
                    <small>{rupee(service.price)}{pt.unit} · minimum {unitWord(service.minUnits || 1)}</small>
                  </div>
                  <div className="units__ctrl">
                    <button onClick={() => setUnits((u) => Math.max(service.minUnits || 1, u - 1))} disabled={units <= (service.minUnits || 1)} aria-label="Fewer">−</button>
                    <span>{unitWord(units)}</span>
                    <button onClick={() => setUnits((u) => Math.min(maxUnits, u + 1))} disabled={units >= maxUnits} aria-label="More"><PlusIcon size={16} /></button>
                  </div>
                </div>
              )}

              <h4 className="sheet__label"><CalendarIcon size={18} /> {isContract ? 'Pick a date for the site visit' : 'Pick a date'}</h4>
              <div className="dates">
                {days.map((d) => (
                  <button key={dayKey(d)} className={`date ${date && dayKey(date) === dayKey(d) ? 'is-on' : ''}`} onClick={() => { setDate(d); setHour(null) }}>
                    <small>{dateLabel(d)}</small>
                    <b>{d.getDate()}</b>
                    <small>{d.toLocaleDateString('en-IN', { month: 'short' })}</small>
                  </button>
                ))}
              </div>

              <h4 className="sheet__label"><ClockIcon size={18} /> {service.pricing === 'daily' ? 'Start time' : 'Pick a time'}</h4>
              {!date ? (
                <p className="hint">Choose a date to see available time slots.</p>
              ) : (
                <div className="slots">
                  {SLOTS.map((h) => {
                    const st = slotState(h)
                    return (
                      <button key={h} disabled={st !== 'open'} className={`slot ${hour === h ? 'is-on' : ''} slot--${st}`} onClick={() => setHour(h)}>
                        {fmtSlot(h)}
                        {st === 'full' && <small>Full</small>}
                        {st === 'past' && <small>Passed</small>}
                      </button>
                    )
                  })}
                </div>
              )}
              {date && hour !== null && (
                <div className="assigned">
                  <img src={pro.image} alt="" />
                  <div>
                    <b>{pro.name} is free at this time</b>
                    <small><Star size={12} color="#FFB800" /> {pro.rating} · {pro.jobs.toLocaleString('en-IN')} jobs · {pro.years} yrs experience</small>
                  </div>
                  <span className="assigned__ok"><CheckIcon size={16} /></span>
                </div>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <div className="sheet__label-row">
                <h4 className="sheet__label"><HomeIcon size={18} /> Where should we come?</h4>
                <button className="link link--sm" onClick={() => setForm({ name: 'Priya Sharma', phone: '98450 12345', address: `Flat 302, Green Glen Apartments, 27th Main, ${settings.area} Sector 2, ${settings.city}`, note: '3rd floor, call when at the gate' })}>
                  Fill demo details
                </button>
              </div>
              <div className="fields">
                <label className="field">
                  <span>Your name</span>
                  <input value={form.name} onChange={set('name')} placeholder="e.g. Priya Sharma" />
                </label>
                <label className="field">
                  <span>Phone number</span>
                  <div className="field__phone">
                    <em>+91</em>
                    <input value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" inputMode="numeric" />
                  </div>
                  {form.phone && !phoneOk && <small className="field__err">Enter a 10-digit mobile number</small>}
                </label>
                <label className="field field--full">
                  <span>Full address</span>
                  <textarea rows={2} value={form.address} onChange={set('address')} placeholder="House / flat no., building, street, area" />
                </label>
                <label className="field field--full">
                  <span>Anything we should know? <i>(optional)</i></span>
                  <input value={form.note} onChange={set('note')} placeholder="e.g. 3rd floor, no lift · bring a ladder" />
                </label>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="summary">
                <div className="summary__row"><CalendarIcon size={18} /><span>{date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}, {fmtSlot(hour)}{hasUnits && ` · ${unitWord(units)}`}</span><button className="link link--sm" onClick={() => setStep(0)}>Change</button></div>
                <div className="summary__row"><HomeIcon size={18} /><span>{form.address}</span><button className="link link--sm" onClick={() => setStep(1)}>Change</button></div>
                <div className="summary__row"><img src={pro.image} alt="" /><span>{pro.name} · {pro.role}</span></div>
              </div>

              <h4 className="sheet__label"><WalletIcon size={18} /> Pay after the job is done</h4>
              <div className="pay">
                {[
                  ['upi', 'UPI', 'GPay, PhonePe, Paytm', settings.upi],
                  ['cash', 'Cash', 'Pay the pro directly', settings.cash],
                ].filter((o) => o[3]).map(([k, t, d]) => (
                  <button key={k} className={`pay__opt ${pay === k ? 'is-on' : ''}`} onClick={() => setPay(k)}>
                    <span className="pay__radio" />
                    <span><b>{t}</b><small>{d}</small></span>
                  </button>
                ))}
              </div>

              <div className="bill">
                {isContract ? (
                  <>
                    <div><span>Site visit & inspection</span><span><em>FREE</em></span></div>
                    <div><span>Estimated project cost</span><span>{priceLabel(service, pricingTypes)}</span></div>
                    <div className="bill__total"><span>To pay now</span><span>₹0</span></div>
                    <p><ShieldIcon size={14} /> You’ll get a written quote after the visit. Work starts only after you approve it.</p>
                  </>
                ) : (
                  <>
                    <div><span>{service.title}{hasUnits && ` × ${unitWord(units)}`}</span><span>{rupee(amount)}</span></div>
                    <div><span>Visit charge</span><span>{settings.waiveVisitFee ? <><s>{rupee(settings.visitFee)}</s> <em>FREE</em></> : rupee(settings.visitFee)}</span></div>
                    <div className="bill__total"><span>To pay after service</span><span>{rupee(amount + (settings.waiveVisitFee ? 0 : settings.visitFee))}</span></div>
                    <p><ShieldIcon size={14} /> Nothing charged now.{hasUnits ? ' Finish early? You pay only for time used.' : ' Extra parts, if any, are billed at MRP with your approval.'}</p>
                  </>
                )}
              </div>
            </>
          )}

          {step === 3 && booking && (
            <div className="success">
              <button className="sheet__close sheet__close--dark" onClick={onClose} aria-label="Close"><CloseIcon size={20} /></button>
              <div className="success__badge">
                <span className="success__ring" />
                <CheckIcon size={44} />
              </div>
              <h2>{isContract ? 'Site visit booked!' : 'Booking confirmed!'}</h2>
              <p>We’ve sent the details to +91 {form.phone}. Booking ID <b>{booking.id}</b></p>

              <div className="ticket">
                <div className="ticket__pro">
                  <img src={pro.image} alt="" />
                  <div>
                    <small>Your pro</small>
                    <b>{pro.name}</b>
                    <span><Star size={12} color="#FFB800" /> {pro.rating} · {pro.role}</span>
                  </div>
                </div>
                <div className="ticket__grid">
                  <div><small>Job</small><b>{service.title}</b></div>
                  <div><small>When</small><b>{dateLabel(date)}, {date.getDate()} {date.toLocaleDateString('en-IN', { month: 'short' })} · {fmtSlot(hour)}</b></div>
                  <div><small>Pay after job</small><b>{payableText}{!isContract && ` via ${pay === 'upi' ? 'UPI' : 'Cash'}`}</b></div>
                  <div><small>Start OTP</small><b className="ok">{booking.otp}</b></div>
                </div>
              </div>
              <button className="btn btn--primary btn--block btn--lg" onClick={() => onTrack(booking.id)}>
                <NavIcon size={18} /> Track this booking
              </button>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="sheet__foot">
            {step > 0 ? (
              <button className="btn btn--ghost" onClick={() => setStep(step - 1)}><ChevronLeft size={18} /> Back</button>
            ) : (
              <div className="sheet__price">
                <b>{isContract ? 'Free visit' : rupee(amount)}</b>
                <small>{isContract ? `project ${priceLabel(service, pricingTypes)}` : hasUnits ? `for ${unitWord(units)} · pay after` : 'pay after service'}</small>
              </div>
            )}
            <button className="btn btn--primary btn--lg" disabled={!canNext} onClick={() => (step === 2 ? confirm() : setStep(step + 1))}>
              {step === 2 ? (isContract ? 'Book site visit' : 'Confirm booking') : 'Continue'} <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
