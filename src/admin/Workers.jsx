import { useState } from 'react'
import { useStore } from '../store'
import { rupee, defaultTeam, photo } from '../data'
import { PageHead, Modal, Toggle, Field, useToast, thisMonth } from './ui'
import { EditIcon, TrashIcon, PlusIcon, Star, PhoneIcon } from '../components/Icons'

const PHOTOS = [...defaultTeam.map((t) => t.image), photo('1472099645785-5658abf4ff4e', 500), photo('1438761681033-6461ffad8d80', 500)]

export default function Workers() {
  const { team, categories, bookings, saveWorker, removeWorker } = useStore()
  const toast = useToast()
  const [edit, setEdit] = useState(null)

  const stats = (id) => {
    const list = bookings.filter((b) => b.proId === id && !b.cancelled)
    const month = list.filter((b) => thisMonth(b.date))
    const rev = month.filter((b) => b.status >= 5).reduce((a, b) => a + (b.amount || 0), 0)
    const live = list.find((b) => b.status === 2 || b.status === 3)
    return { month: month.length, rev, live }
  }

  return (
    <>
      <PageHead title="Workers" sub={`${team.length} people on the team · ${team.filter((w) => w.available).length} available today`}>
        <button className="btn btn--primary btn--sm" onClick={() => setEdit({ id: 'w' + Date.now(), name: '', role: '', years: 1, rating: 5, jobs: 0, phone: '', image: PHOTOS[5], skills: [], available: true, payout: 70, isNew: true })}>
          <PlusIcon size={16} /> Add worker
        </button>
      </PageHead>

      <div className="a-workers">
        {team.map((w) => {
          const s = stats(w.id)
          return (
            <article key={w.id} className={`a-worker ${w.available ? '' : 'is-off'}`}>
              <div className="a-worker__top">
                <img src={w.image} alt="" />
                <div>
                  <b>{w.name}</b>
                  <small>{w.role}</small>
                  <span className="a-rating"><Star size={12} color="#FFB800" /> {w.rating.toFixed(1)} · {w.years} yrs · {w.jobs.toLocaleString('en-IN')} jobs</span>
                </div>
              </div>
              {s.live && <div className="a-worker__live"><i /> On a job now: {s.live.title}</div>}
              <div className="a-worker__skills">
                {w.skills.map((k) => { const c = categories.find((x) => x.id === k); return c && <span key={k}>{c.emoji} {c.name}</span> })}
              </div>
              <div className="a-worker__stats">
                <div><small>Jobs this month</small><b>{s.month}</b></div>
                <div><small>Revenue</small><b>{rupee(s.rev)}</b></div>
                <div><small>Payout ({w.payout}%)</small><b>{rupee((s.rev * w.payout) / 100)}</b></div>
              </div>
              <div className="a-worker__foot">
                <label><Toggle on={w.available} label={`${w.name} available`} onChange={(v) => { saveWorker({ id: w.id, available: v }); toast(`${w.name.split(' ')[0]} marked ${v ? 'available' : 'unavailable'}`) }} /> {w.available ? 'Available' : 'Unavailable'}</label>
                <div>
                  <a className="a-icon" href={`tel:+91${w.phone.replace(/\s/g, '')}`} aria-label="Call"><PhoneIcon size={16} /></a>
                  <button className="a-icon" onClick={() => setEdit(w)} aria-label="Edit"><EditIcon size={16} /></button>
                  <button className="a-icon a-danger" onClick={() => { if (confirm(`Remove ${w.name} from the team?`)) { removeWorker(w.id); toast('Worker removed') } }} aria-label="Remove"><TrashIcon size={16} /></button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {edit && <WorkerForm w={edit} categories={categories} onClose={() => setEdit(null)} onSave={(w) => { const { isNew, ...rest } = w; saveWorker(rest); toast(isNew ? 'Worker added' : 'Worker updated'); setEdit(null) }} />}
    </>
  )
}

function WorkerForm({ w, categories, onClose, onSave }) {
  const [x, setX] = useState(w)
  const set = (k) => (e) => setX((v) => ({ ...v, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))
  const toggleSkill = (id) => setX((v) => ({ ...v, skills: v.skills.includes(id) ? v.skills.filter((s) => s !== id) : [...v.skills, id] }))
  const ok = x.name.trim() && x.role.trim() && x.skills.length

  return (
    <Modal title={w.isNew ? 'Add a worker' : `Edit ${w.name}`} onClose={onClose} wide footer={<><button className="btn btn--ghost" onClick={onClose}>Cancel</button><button className="btn btn--primary" disabled={!ok} onClick={() => onSave(x)}>Save worker</button></>}>
      <div className="a-form">
        <Field label="Full name"><input value={x.name} onChange={set('name')} placeholder="e.g. Suresh Babu" /></Field>
        <Field label="Role / title"><input value={x.role} onChange={set('role')} placeholder="e.g. AC Technician" /></Field>
        <Field label="Phone"><input value={x.phone} onChange={set('phone')} placeholder="98450 00000" /></Field>
        <Field label="Years of experience"><input type="number" min="0" value={x.years} onChange={set('years')} /></Field>
        <Field label="Payout share (%)" hint="Share of each job paid to the worker"><input type="number" min="0" max="100" value={x.payout} onChange={set('payout')} /></Field>
        <Field label="Rating"><input type="number" min="1" max="5" step="0.1" value={x.rating} onChange={set('rating')} /></Field>
        <div className="a-field a-field--full">
          <span>Skills — which jobs can they do?</span>
          <div className="a-chips">
            {categories.map((c) => (
              <button type="button" key={c.id} className={x.skills.includes(c.id) ? 'is-on' : ''} onClick={() => toggleSkill(c.id)}>{c.emoji} {c.name}</button>
            ))}
          </div>
        </div>
        <div className="a-field a-field--full">
          <span>Photo</span>
          <div className="a-imgpick a-imgpick--round">
            {PHOTOS.map((src) => (
              <button type="button" key={src} className={x.image === src ? 'is-on' : ''} onClick={() => setX((v) => ({ ...v, image: src }))}><img src={src} alt="" /></button>
            ))}
          </div>
        </div>
        <label className="a-field a-field--row"><Toggle on={x.available} onChange={(v) => setX((p) => ({ ...p, available: v }))} label="Available" /> <span>Available for new bookings</span></label>
      </div>
    </Modal>
  )
}
