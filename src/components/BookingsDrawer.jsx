import { STATUSES, rupee, fmtSlot, parseDay } from '../data'
import { useStore } from '../store'
import { CloseIcon, CalendarIcon, ChevronRight } from './Icons'
import { EmptyIllo } from './Illustrations'

export const statusTone = (b) => (b.cancelled ? 'muted' : b.status >= 5 ? 'good' : b.status === 4 ? 'warn' : b.status >= 2 ? 'live' : 'idle')
export const statusText = (b) => (b.cancelled ? 'Cancelled' : STATUSES[b.status].short)

export default function BookingsDrawer({ onClose, onBrowse, onOpen }) {
  const { bookings, team } = useStore()
  const mine = bookings.filter((b) => b.mine)
  const active = mine.filter((b) => !b.cancelled && b.status < 5)
  const past = mine.filter((b) => b.cancelled || b.status >= 5)

  const Card = ({ b }) => {
    const pro = team.find((m) => m.id === b.proId)
    return (
      <button className="bcard" onClick={() => onOpen(b.id)}>
        <div>
          <span className={`chip-status chip-status--${statusTone(b)}`}>{statusTone(b) === 'live' && <i />}{statusText(b)}</span>
          <h3>{b.title}</h3>
          <p><CalendarIcon size={14} /> {parseDay(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, {fmtSlot(b.hour)}</p>
          {pro && <p className="bcard__pro"><img src={pro.image} alt="" /> {pro.name}</p>}
          <div className="bcard__foot">
            <span>#{b.id}</span>
            <b>{b.amount != null ? rupee(b.amount) : 'Quote pending'}</b>
          </div>
        </div>
        <ChevronRight size={18} />
      </button>
    )
  }

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="My bookings">
      <div className="sheet__scrim" onClick={onClose} />
      <aside className="drawer__panel">
        <div className="drawer__head">
          <h2>My bookings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><CloseIcon size={20} /></button>
        </div>
        {mine.length === 0 ? (
          <div className="empty empty--sm">
            <EmptyIllo />
            <h3>No bookings yet</h3>
            <p>Your upcoming jobs will show up here.</p>
            <button className="btn btn--primary" onClick={onBrowse}>Find a job</button>
          </div>
        ) : (
          <div className="blist">
            {active.length > 0 && <h4 className="blist__label">Active</h4>}
            {active.map((b) => <Card key={b.id} b={b} />)}
            {past.length > 0 && <h4 className="blist__label">Past</h4>}
            {past.map((b) => <Card key={b.id} b={b} />)}
          </div>
        )}
      </aside>
    </div>
  )
}
