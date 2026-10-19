import { reviews, popularSearches, photo, rupee, priceLabel } from '../data'
import { usePublicCatalog, useStore } from '../store'
import SearchBar from './SearchBar'
import ServiceCard from './ServiceCard'
import { SearchIllo, CalendarIllo, DoneIllo, Squiggle } from './Illustrations'
import { Star, ShieldIcon, WalletIcon, TagIcon, ClockIcon, CheckIcon, ArrowRight } from './Icons'

const PRICING_EXAMPLES = { fixed: 's1', hourly: 's6', daily: 's18', contract: 's19' }

export default function Home({ query, setQuery, onSearch, onBook }) {
  const { services, categories, pricingTypes, team } = usePublicCatalog()
  const { settings } = useStore()
  const popular = ['s1', 's6', 's4', 's8', 's19', 's16', 's13', 's15'].map((id) => services.find((s) => s.id === id)).filter(Boolean)
  const freeCount = team.filter((m) => m.available).length

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero__blob hero__blob--a" />
        <div className="hero__blob hero__blob--b" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <span className="pill pill--live"><i /> {freeCount} pros available today in {settings.area}</span>
            <h1>
              Plumber, porter, painter?<br />
              <span className="hl">Book in 60 seconds.<Squiggle /></span>
            </h1>
            <p className="hero__sub">
              Search the job, pick a date and time. Our verified pros show up, get it done, and you pay only after the work is finished.
            </p>

            <SearchBar value={query} onChange={setQuery} onSearch={onSearch} onPickService={onBook} />

            <div className="hero__popular">
              <span>Popular:</span>
              {popularSearches.map((p) => (
                <button key={p} className="chip" onClick={() => onSearch(p, null)}>{p}</button>
              ))}
            </div>

            <ul className="hero__trust">
              <li><WalletIcon size={18} /> Pay after the job</li>
              <li><TagIcon size={18} /> Fixed, hourly or contract</li>
              <li><ShieldIcon size={18} /> Verified pros</li>
            </ul>
          </div>

          <div className="hero__art">
            <div className="collage">
              <img className="collage__main" src={photo('1621905251918-48416bd8575a', 900)} alt="Electrician fixing a switchboard" />
              <img className="collage__side collage__side--a" src={photo('1585704032915-c3400ca199e7', 500)} alt="Plumber fixing a tap" />
              <img className="collage__side collage__side--b" src={photo('1600518464441-9154a4dea21b', 500)} alt="Movers loading a truck" />

              <div className="float float--track">
                <img src={team[0].image} alt="" />
                <div>
                  <b>Ravi is on the way</b>
                  <small>Arriving in 12 min</small>
                </div>
                <span className="float__eta">🛵</span>
              </div>
              <div className="float float--rating">
                <Star size={18} color="#FFC93C" />
                <div>
                  <b>4.9 rating</b>
                  <small>from 5,700+ jobs</small>
                </div>
              </div>
              <div className="float float--paid">
                <span className="float__check"><CheckIcon size={16} /></span>
                <div>
                  <b>Paid ₹199 via UPI</b>
                  <small>after the job ✓</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section" id="services">
        <div className="container">
          <div className="section__head">
            <div>
              <span className="eyebrow">What do you need help with?</span>
              <h2>Pick a job, we'll send a pro</h2>
            </div>
          </div>
          <div className="cats">
            {categories.map((c) => (
              <button key={c.id} className="cat" onClick={() => onSearch('', c.id)} style={{ '--tint': c.tint }}>
                <span className="cat__img"><img src={c.image.replace('w=900', 'w=500')} alt="" loading="lazy" /></span>
                <span className="cat__body">
                  <b>{c.name}</b>
                  <small>{isFinite(c.from) ? `from ${rupee(c.from)}` : 'Coming soon'}</small>
                </span>
                <span className="cat__go"><ArrowRight size={16} /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TYPES */}
      <section className="section section--pt0">
        <div className="container">
          <div className="ptypes">
            <div className="ptypes__intro">
              <span className="eyebrow">Pay the way the job needs</span>
              <h2>Small fix or big project — there’s a plan for it</h2>
              <p className="section__lede">Every job shows how it’s priced before you book. No haggling at the door.</p>
            </div>
            <div className="ptypes__grid">
              {pricingTypes.map((p) => {
                const ex = services.find((s) => s.id === PRICING_EXAMPLES[p.id]) ?? services.find((s) => s.pricing === p.id)
                return (
                  <button key={p.id} className={`ptype ptype--${p.id}`} onClick={() => onSearch('', null, p.id)}>
                    <span className="ptype__icon">{p.icon}</span>
                    <b>{p.name}</b>
                    <small>{p.desc}</small>
                    {ex && <span className="ptype__ex">e.g. {ex.title} · <em>{priceLabel(ex, pricingTypes)}</em></span>}
                    <span className="ptype__go">See jobs <ArrowRight size={14} /></span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section--tint" id="how">
        <div className="container">
          <div className="section__head section__head--center">
            <span className="eyebrow">How it works</span>
            <h2>Three taps. One less thing to worry about.</h2>
          </div>
          <div className="steps">
            {[
              { n: 1, Illo: SearchIllo, t: 'Search the job', d: 'Type what needs fixing — “leaking tap”, “porter”. See the price — fixed, hourly or by contract — before you book.' },
              { n: 2, Illo: CalendarIllo, t: 'Pick a date & time', d: 'Choose any slot in the next 7 days. We confirm instantly if a pro is free.' },
              { n: 3, Illo: DoneIllo, t: 'Job done, then pay', d: 'Track your pro live, then pay by cash or UPI only when the work is done.' },
            ].map(({ n, Illo, t, d }) => (
              <div key={n} className="step">
                <Illo />
                <span className="step__n">{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <span className="eyebrow">Most booked this week</span>
              <h2>Popular near you</h2>
            </div>
            <button className="link" onClick={() => onSearch('', null)}>See all jobs <ArrowRight size={16} /></button>
          </div>
          <div className="rail">
            {popular.map((s) => <ServiceCard key={s.id} s={s} onBook={onBook} />)}
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="band">
        <div className="container band__grid">
          {[
            ['5,700+', 'jobs completed'],
            ['4.9★', 'average rating'],
            ['< 2 hrs', 'typical arrival'],
            ['₹0', 'paid before the job'],
          ].map(([k, v]) => (
            <div key={v} className="band__stat">
              <b>{k}</b>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="section" id="team">
        <div className="container">
          <div className="section__head">
            <div>
              <span className="eyebrow">Our team</span>
              <h2>The people who actually show up</h2>
              <p className="section__lede">No random strangers. Trained, background-checked pros who work for Workers Spot full-time.</p>
            </div>
          </div>
          <div className="team">
            {team.map((m) => (
              <article key={m.id} className="member">
                <div className="member__img">
                  <img src={m.image} alt={m.name} loading="lazy" />
                  <span className={`member__status ${m.available ? '' : 'is-busy'}`}>
                    <i /> {m.available ? 'Free today' : 'On a job'}
                  </span>
                </div>
                <div className="member__body">
                  <h3>{m.name}</h3>
                  <p>{m.role}</p>
                  <div className="member__meta">
                    <span><Star size={13} color="#FFB800" /> {m.rating.toFixed(1)}</span>
                    <span>{m.jobs.toLocaleString('en-IN')} jobs</span>
                    <span>{m.years} yrs</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section section--tint">
        <div className="container">
          <div className="section__head section__head--center">
            <span className="eyebrow">Loved by neighbours</span>
            <h2>Real jobs. Real reviews.</h2>
          </div>
          <div className="reviews">
            {reviews.map((r) => (
              <figure key={r.name} className="review">
                <div className="review__stars">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={16} color="#FFB800" />)}</div>
                <blockquote>“{r.text}”</blockquote>
                <figcaption>
                  <span className="review__av" style={{ background: r.color }}>{r.name[0]}</span>
                  <span>
                    <b>{r.name}</b>
                    <small>{r.area} · {r.job}</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta">
            <div className="cta__copy">
              <h2>Got a job? We’ve got the hands.</h2>
              <p>Fixed, hourly or contract. Same-day slots. Pay after it’s done.</p>
              <div className="cta__points">
                <span><ClockIcon size={16} /> Slots from 8 AM – 7 PM</span>
                <span><ShieldIcon size={16} /> {settings.guaranteeDays}-day re-work guarantee</span>
              </div>
            </div>
            <button className="btn btn--sun btn--lg" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
              Search a job <ArrowRight size={20} />
            </button>
            <img className="cta__img" src={photo('1621905252507-b35492cc74b4', 600)} alt="" />
          </div>
        </div>
      </section>
    </main>
  )
}
