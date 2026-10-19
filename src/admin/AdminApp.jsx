import { useState } from 'react'
import { useStore } from '../store'
import { LogoMark, GridIcon, ListIcon, CardIcon, BriefcaseIcon, LayersIcon, UsersIcon, SettingsIcon, LogoutIcon, ExternalIcon, MenuIcon, KeyIcon } from '../components/Icons'
import { photo } from '../data'
import { ToastProvider } from './ui'
import Dashboard from './Dashboard'
import Bookings from './Bookings'
import Payments from './Payments'
import Jobs from './Jobs'
import JobTypes from './JobTypes'
import Workers from './Workers'
import Settings from './Settings'
import './admin.css'

const AUTH = 'workers-spot-admin'

const NAV = [
  { path: '/admin', label: 'Dashboard', Icon: GridIcon, Page: Dashboard },
  { path: '/admin/bookings', label: 'Bookings', Icon: ListIcon, Page: Bookings },
  { path: '/admin/payments', label: 'Payments', Icon: CardIcon, Page: Payments },
  { path: '/admin/jobs', label: 'Job postings', Icon: BriefcaseIcon, Page: Jobs },
  { path: '/admin/job-types', label: 'Job types & pricing', Icon: LayersIcon, Page: JobTypes },
  { path: '/admin/workers', label: 'Workers', Icon: UsersIcon, Page: Workers },
  { path: '/admin/settings', label: 'Settings', Icon: SettingsIcon, Page: Settings },
]

const readAuth = () => { try { return sessionStorage.getItem(AUTH) === '1' } catch { return false } }

export default function AdminApp({ path, go }) {
  const [authed, setAuthed] = useState(readAuth)
  const [menu, setMenu] = useState(false)
  const { bookings } = useStore()

  if (!authed) return <Login onLogin={() => { try { sessionStorage.setItem(AUTH, '1') } catch { /* ignore */ } setAuthed(true) }} go={go} />

  const clean = path.replace(/\/$/, '') || '/admin'
  const current = NAV.find((n) => n.path === clean) ?? NAV[0]
  const Page = current.Page
  const live = bookings.filter((b) => !b.cancelled && b.status >= 1 && b.status <= 3).length

  const logout = () => { try { sessionStorage.removeItem(AUTH) } catch { /* ignore */ } setAuthed(false) }

  return (
    <ToastProvider>
      <div className="admin">
        <aside className={`a-side ${menu ? 'is-open' : ''}`}>
          <div className="a-brand">
            <LogoMark size={32} />
            <div>
              <b>workers<em>spot</em></b>
              <small>Admin console</small>
            </div>
          </div>
          <nav className="a-nav">
            {NAV.map(({ path: p, label, Icon }) => (
              <a key={p} href={p} className={current.path === p ? 'is-on' : ''} onClick={(e) => { e.preventDefault(); setMenu(false); go(p) }}>
                <Icon size={18} />
                <span>{label}</span>
                {p === '/admin/bookings' && live > 0 && <em>{live}</em>}
              </a>
            ))}
          </nav>
          <div className="a-side__foot">
            <a href="/" onClick={(e) => { e.preventDefault(); go('/') }}><ExternalIcon size={16} /> View customer site</a>
            <button onClick={logout}><LogoutIcon size={16} /> Log out</button>
          </div>
        </aside>
        {menu && <div className="a-side__scrim" onClick={() => setMenu(false)} />}

        <div className="a-main">
          <header className="a-top">
            <button className="a-icon a-top__menu" onClick={() => setMenu(true)} aria-label="Open menu"><MenuIcon size={20} /></button>
            <span className="a-top__crumb">Admin <i>/</i> <b>{current.label}</b></span>
            <span className="a-top__demo">Demo mode — changes save in this browser</span>
            <div className="a-top__user">
              <span className="a-avatar a-avatar--txt" style={{ width: 34, height: 34 }}>A</span>
              <div><b>Admin</b><small>Owner</small></div>
            </div>
          </header>
          <div className="a-content">
            <Page go={go} />
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}

function Login({ onLogin, go }) {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (u.trim() === 'admin' && p === 'admin') onLogin()
    else setErr('Wrong username or password. For this demo, use admin / admin.')
  }

  return (
    <div className="a-login">
      <div className="a-login__art">
        <img src={photo('1621905252507-b35492cc74b4', 1000)} alt="" />
        <div className="a-login__shade" />
        <div className="a-login__copy">
          <div className="a-brand a-brand--light">
            <LogoMark size={36} />
            <div><b>workers<em>spot</em></b><small>Admin console</small></div>
          </div>
          <h2>Run every job, worker and payment from one place.</h2>
          <ul>
            <li>Live bookings & status updates</li>
            <li>Jobs, prices and pricing types</li>
            <li>Workers, payouts & revenue</li>
          </ul>
        </div>
      </div>
      <form className="a-login__form" onSubmit={submit}>
        <div className="a-login__box">
          <span className="a-login__key"><KeyIcon size={22} /></span>
          <h1>Sign in to admin</h1>
          <p>Manage Workers Spot’s jobs, team and bookings.</p>
          <label className="a-field">
            <span>Username</span>
            <input value={u} onChange={(e) => { setU(e.target.value); setErr('') }} autoFocus autoComplete="username" placeholder="admin" />
          </label>
          <label className="a-field">
            <span>Password</span>
            <input type="password" value={p} onChange={(e) => { setP(e.target.value); setErr('') }} autoComplete="current-password" placeholder="•••••" />
          </label>
          {err && <div className="a-login__err">{err}</div>}
          <button className="btn btn--primary btn--lg btn--block" type="submit">Sign in</button>
          <div className="a-login__hint">
            <b>Demo credentials</b>
            <span>Username <code>admin</code> · Password <code>admin</code></span>
            <button type="button" className="link link--sm" onClick={() => { setU('admin'); setP('admin') }}>Fill them in</button>
          </div>
          <button type="button" className="a-login__back" onClick={() => go('/')}>← Back to the customer site</button>
        </div>
      </form>
    </div>
  )
}
