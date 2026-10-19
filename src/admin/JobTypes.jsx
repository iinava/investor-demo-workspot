import { useState } from 'react'
import { useStore } from '../store'
import { defaultCategories } from '../data'
import { PageHead, Modal, Toggle, Field, useToast } from './ui'
import { EditIcon, TrashIcon, PlusIcon } from '../components/Icons'

const TINTS = ['#E6F4FF', '#FFF6DB', '#FFEDE3', '#E9F9EF', '#F1ECFF', '#FFF1E6', '#EAF2F2', '#EEF7E4']
const IMAGES = defaultCategories.map((c) => c.image)

export default function JobTypes() {
  const { pricingTypes, categories, services, savePricingType, saveCategory, removeCategory } = useStore()
  const toast = useToast()
  const [editPt, setEditPt] = useState(null)
  const [editCat, setEditCat] = useState(null)

  const jobsIn = (k, v) => services.filter((s) => s[k] === v).length

  return (
    <>
      <PageHead title="Job types & pricing" sub="Control how jobs are priced and how they’re grouped on the website." />

      <section className="a-card">
        <div className="a-card__head"><div><h3>Pricing types</h3><p>Turn a type off to hide every job that uses it.</p></div></div>
        <div className="a-ptgrid">
          {pricingTypes.map((p) => (
            <div key={p.id} className={`a-pt ${p.active ? '' : 'is-off'}`}>
              <div className="a-pt__top">
                <span className={`a-pt__icon a-pt__icon--${p.id}`}>{p.icon}</span>
                <Toggle on={p.active} label={`${p.name} enabled`} onChange={(v) => { savePricingType({ id: p.id, active: v }); toast(`${p.name} ${v ? 'enabled' : 'disabled'}`) }} />
              </div>
              <b>{p.name}</b>
              <p>{p.desc}</p>
              <div className="a-pt__foot">
                <span>{jobsIn('pricing', p.id)} jobs · billed per {p.unitLabel}</span>
                <button className="a-icon" onClick={() => setEditPt(p)} aria-label={`Edit ${p.name}`}><EditIcon size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="a-card">
        <div className="a-card__head">
          <div><h3>Categories</h3><p>The job categories customers browse on the home page.</p></div>
          <button className="btn btn--primary btn--sm" onClick={() => setEditCat({ id: 'c' + Date.now(), name: '', emoji: '🔧', tint: TINTS[0], image: IMAGES[0], active: true, isNew: true })}><PlusIcon size={16} /> Add category</button>
        </div>
        <div className="a-catgrid">
          {categories.map((c) => (
            <div key={c.id} className={`a-cat ${c.active ? '' : 'is-off'}`} style={{ '--tint': c.tint }}>
              <img src={c.image.replace('w=900', 'w=300')} alt="" />
              <div className="a-cat__body">
                <b>{c.emoji} {c.name}</b>
                <small>{jobsIn('cat', c.id)} jobs</small>
              </div>
              <div className="a-cat__actions">
                <Toggle on={c.active} label={`${c.name} visible`} onChange={(v) => { saveCategory({ id: c.id, active: v }); toast(`${c.name} ${v ? 'visible' : 'hidden'} on site`) }} />
                <button className="a-icon" onClick={() => setEditCat(c)} aria-label="Edit"><EditIcon size={16} /></button>
                <button className="a-icon a-danger" aria-label="Delete" onClick={() => {
                  if (jobsIn('cat', c.id)) return toast(`Move or delete its ${jobsIn('cat', c.id)} jobs first`)
                  removeCategory(c.id); toast('Category deleted')
                }}><TrashIcon size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {editPt && <PricingForm p={editPt} onClose={() => setEditPt(null)} onSave={(p) => { savePricingType(p); toast('Pricing type updated'); setEditPt(null) }} />}
      {editCat && <CategoryForm c={editCat} onClose={() => setEditCat(null)} onSave={(c) => { const { isNew, ...rest } = c; saveCategory(rest); toast(isNew ? 'Category added' : 'Category updated'); setEditCat(null) }} />}
    </>
  )
}

function PricingForm({ p, onClose, onSave }) {
  const [x, setX] = useState(p)
  const set = (k) => (e) => setX((v) => ({ ...v, [k]: e.target.value }))
  return (
    <Modal title={`Edit “${p.name}”`} onClose={onClose} footer={<><button className="btn btn--ghost" onClick={onClose}>Cancel</button><button className="btn btn--primary" onClick={() => onSave(x)}>Save</button></>}>
      <div className="a-form">
        <Field label="Display name"><input value={x.name} onChange={set('name')} /></Field>
        <Field label="Icon (emoji)"><input value={x.icon} onChange={set('icon')} maxLength={4} /></Field>
        <Field label="Price suffix" hint="Shown after the rate, e.g. /hr"><input value={x.unit} onChange={set('unit')} /></Field>
        <Field label="Billing unit"><input value={x.unitLabel} onChange={set('unitLabel')} /></Field>
        <Field label="Description for customers" full><textarea rows={2} value={x.desc} onChange={set('desc')} /></Field>
      </div>
    </Modal>
  )
}

function CategoryForm({ c, onClose, onSave }) {
  const [x, setX] = useState(c)
  const set = (k) => (e) => setX((v) => ({ ...v, [k]: e.target.value }))
  return (
    <Modal title={c.isNew ? 'New category' : `Edit “${c.name}”`} onClose={onClose} footer={<><button className="btn btn--ghost" onClick={onClose}>Cancel</button><button className="btn btn--primary" disabled={!x.name.trim()} onClick={() => onSave(x)}>Save</button></>}>
      <div className="a-form">
        <Field label="Name"><input value={x.name} onChange={set('name')} placeholder="e.g. AC & Appliances" /></Field>
        <Field label="Icon (emoji)"><input value={x.emoji} onChange={set('emoji')} maxLength={4} /></Field>
        <div className="a-field a-field--full">
          <span>Card colour</span>
          <div className="a-swatches">
            {TINTS.map((t) => <button type="button" key={t} style={{ background: t }} className={x.tint === t ? 'is-on' : ''} onClick={() => setX((v) => ({ ...v, tint: t }))} aria-label={t} />)}
          </div>
        </div>
        <div className="a-field a-field--full">
          <span>Cover photo</span>
          <div className="a-imgpick">
            {IMAGES.map((src) => (
              <button type="button" key={src} className={x.image === src ? 'is-on' : ''} onClick={() => setX((v) => ({ ...v, image: src }))}><img src={src.replace('w=900', 'w=160')} alt="" /></button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
