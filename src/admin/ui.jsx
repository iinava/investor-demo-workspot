import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { STATUSES } from '../data'
import { CloseIcon, CheckIcon } from '../components/Icons'

export const PageHead = ({ title, sub, children }) => (
  <div className="a-head">
    <div>
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
    </div>
    {children && <div className="a-head__actions">{children}</div>}
  </div>
)

export const Toggle = ({ on, onChange, label }) => (
  <button type="button" role="switch" aria-checked={on} aria-label={label} className={`a-toggle ${on ? 'is-on' : ''}`} onClick={(e) => { e.stopPropagation(); onChange(!on) }}>
    <span />
  </button>
)

export const Field = ({ label, hint, children, full }) => (
  <label className={`a-field ${full ? 'a-field--full' : ''}`}>
    <span>{label}</span>
    {children}
    {hint && <small>{hint}</small>}
  </label>
)

export function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="a-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="a-modal__scrim" onClick={onClose} />
      <div className={`a-modal__panel ${wide ? 'is-wide' : ''}`}>
        <div className="a-modal__head">
          <h2>{title}</h2>
          <button className="a-icon" onClick={onClose} aria-label="Close"><CloseIcon size={18} /></button>
        </div>
        <div className="a-modal__body">{children}</div>
        {footer && <div className="a-modal__foot">{footer}</div>}
      </div>
    </div>
  )
}

export function Panel({ title, onClose, children }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="a-panel" role="dialog" aria-modal="true" aria-label={title}>
      <div className="a-modal__scrim" onClick={onClose} />
      <aside className="a-panel__body">
        <div className="a-modal__head">
          <h2>{title}</h2>
          <button className="a-icon" onClick={onClose} aria-label="Close"><CloseIcon size={18} /></button>
        </div>
        {children}
      </aside>
    </div>
  )
}

export const bookingTone = (b) => (b.cancelled ? 'muted' : b.status >= 5 ? 'good' : b.status === 4 ? 'warn' : b.status >= 2 ? 'live' : 'idle')
export const BookingStatus = ({ b }) => (
  <span className={`chip-status chip-status--${bookingTone(b)}`}>
    {bookingTone(b) === 'live' && <i />}
    {b.cancelled ? 'Cancelled' : STATUSES[b.status].short}
  </span>
)

export const Avatar = ({ src, name, size = 32 }) =>
  src ? <img className="a-avatar" src={src} alt="" width={size} height={size} style={{ width: size, height: size }} /> : (
    <span className="a-avatar a-avatar--txt" style={{ width: size, height: size }}>{name?.[0]}</span>
  )

export function Pager({ page, pages, setPage, total, label = 'rows' }) {
  if (pages <= 1) return <div className="a-pager"><span>{total} {label}</span></div>
  return (
    <div className="a-pager">
      <span>{total} {label}</span>
      <div>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>‹ Prev</button>
        <b>{page + 1} / {pages}</b>
        <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next ›</button>
      </div>
    </div>
  )
}

/* Toasts */
const ToastCtx = createContext(() => {})
export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null)
  const show = useCallback((m) => {
    setMsg(m)
    clearTimeout(show.t)
    show.t = setTimeout(() => setMsg(null), 2600)
  }, [])
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {msg && <div className="toast" role="status"><span><CheckIcon size={16} /></span> {msg}</div>}
    </ToastCtx.Provider>
  )
}
export const useToast = () => useContext(ToastCtx)

export const thisMonth = (dateKey) => {
  const n = new Date()
  const [y, m] = dateKey.split('-').map(Number)
  return y === n.getFullYear() && m === n.getMonth() + 1
}
