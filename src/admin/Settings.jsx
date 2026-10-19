import { useState } from 'react'
import { useStore } from '../store'
import { fmtSlot } from '../data'
import { PageHead, Toggle, Field, useToast } from './ui'
import { RefreshIcon } from '../components/Icons'

const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

export default function Settings() {
  const { settings, saveSettings, reset } = useStore()
  const toast = useToast()
  const [x, setX] = useState(settings)
  const set = (k) => (e) => setX((v) => ({ ...v, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))
  const toggleSlot = (h) => setX((v) => ({ ...v, slots: v.slots.includes(h) ? v.slots.filter((s) => s !== h) : [...v.slots, h].sort((a, b) => a - b) }))
  const dirty = JSON.stringify(x) !== JSON.stringify(settings)

  const save = () => {
    if (!x.slots.length) return toast('Pick at least one time slot')
    if (!x.upi && !x.cash) return toast('Enable at least one payment method')
    saveSettings(x)
    toast('Settings saved — live on the site')
  }

  return (
    <>
      <PageHead title="Settings" sub="Business details, booking rules and payment options.">
        <button className="btn btn--primary btn--sm" disabled={!dirty} onClick={save}>Save changes</button>
      </PageHead>

      <div className="a-grid a-grid--1-1">
        <section className="a-card">
          <div className="a-card__head"><div><h3>Business details</h3><p>Shown in the site header and footer.</p></div></div>
          <div className="a-form">
            <Field label="Business name"><input value={x.businessName} onChange={set('businessName')} /></Field>
            <Field label="Support phone"><input value={x.phone} onChange={set('phone')} /></Field>
            <Field label="Support email" full><input value={x.email} onChange={set('email')} /></Field>
            <Field label="Service area"><input value={x.area} onChange={set('area')} /></Field>
            <Field label="City"><input value={x.city} onChange={set('city')} /></Field>
          </div>
        </section>

        <section className="a-card">
          <div className="a-card__head"><div><h3>Payments</h3><p>Customers always pay after the job.</p></div></div>
          <div className="a-switches">
            <label><div><b>UPI</b><small>GPay, PhonePe, Paytm</small></div><Toggle on={x.upi} onChange={(v) => setX((p) => ({ ...p, upi: v }))} label="UPI" /></label>
            <label><div><b>Cash</b><small>Paid to the worker on site</small></div><Toggle on={x.cash} onChange={(v) => setX((p) => ({ ...p, cash: v }))} label="Cash" /></label>
            <label><div><b>Waive visit charge</b><small>Show the visit fee as FREE</small></div><Toggle on={x.waiveVisitFee} onChange={(v) => setX((p) => ({ ...p, waiveVisitFee: v }))} label="Waive visit charge" /></label>
          </div>
          <div className="a-form">
            <Field label="Visit charge (₹)"><input type="number" min="0" value={x.visitFee} onChange={set('visitFee')} /></Field>
            <Field label="Re-work guarantee (days)"><input type="number" min="0" value={x.guaranteeDays} onChange={set('guaranteeDays')} /></Field>
          </div>
        </section>
      </div>

      <section className="a-card">
        <div className="a-card__head"><div><h3>Booking time slots</h3><p>Start times customers can pick. {x.slots.length} selected.</p></div></div>
        <div className="a-slots">
          {HOURS.map((h) => <button key={h} className={x.slots.includes(h) ? 'is-on' : ''} onClick={() => toggleSlot(h)}>{fmtSlot(h)}</button>)}
        </div>
      </section>

      <div className="a-grid a-grid--1-1">
        <section className="a-card">
          <div className="a-card__head"><div><h3>Admin access</h3><p>Demo credentials for this console.</p></div></div>
          <div className="a-kv">
            <div><span>Username</span><b className="a-mono">admin</b></div>
            <div><span>Password</span><b className="a-mono">admin</b></div>
            <div><span>Role</span><b>Owner (full access)</b></div>
          </div>
          <p className="a-hint">In the real product this becomes proper staff accounts with roles (owner, dispatcher, accountant).</p>
        </section>

        <section className="a-card">
          <div className="a-card__head"><div><h3>Demo data</h3><p>Everything you change is saved in this browser.</p></div></div>
          <p className="a-hint">Reset to restore the original jobs, workers, prices and sample bookings — handy before a pitch.</p>
          <button className="btn btn--outline btn--sm a-danger-outline" onClick={() => { if (confirm('Reset all demo data?')) { reset(); toast('Demo data reset'); setTimeout(() => window.location.reload(), 400) } }}>
            <RefreshIcon size={16} /> Reset demo data
          </button>
        </section>
      </div>
    </>
  )
}
