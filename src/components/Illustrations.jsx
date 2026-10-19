// Worktree illustration kit: flat shapes, chunky 3px ink outlines,
// brand green / sun yellow / coral on a soft cream blob.
const INK = '#10291F'
const GREEN = '#0F9D58'
const SUN = '#FFC93C'
const CORAL = '#FF7A59'
const CREAM = '#FFF3DC'
const s = { stroke: INK, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const SearchIllo = () => (
  <svg viewBox="0 0 220 170" className="illo" aria-hidden="true">
    <path d="M30 95c-8-40 30-75 80-72s88 30 80 70-40 68-90 66-62-24-70-64z" fill={CREAM} />
    <rect x="70" y="22" width="80" height="130" rx="16" fill="#fff" {...s} />
    <rect x="82" y="44" width="56" height="16" rx="8" fill="#E9F9EF" {...s} strokeWidth="2.5" />
    <circle cx="91" cy="52" r="3" fill={GREEN} />
    <rect x="82" y="70" width="25" height="25" rx="7" fill={SUN} {...s} strokeWidth="2.5" />
    <rect x="113" y="70" width="25" height="25" rx="7" fill={CORAL} {...s} strokeWidth="2.5" />
    <rect x="82" y="101" width="25" height="25" rx="7" fill="#BDE8CF" {...s} strokeWidth="2.5" />
    <rect x="113" y="101" width="25" height="25" rx="7" fill="#fff" {...s} strokeWidth="2.5" />
    <circle cx="162" cy="62" r="20" fill="#fff" {...s} />
    <circle cx="162" cy="62" r="11" fill={GREEN} opacity=".18" />
    <path d="m176 77 16 16" {...s} strokeWidth="7" />
    <path d="M40 40l4 8M34 50l8 2M186 128l6 4M190 120l8-1" {...s} strokeWidth="2.5" stroke={GREEN} />
  </svg>
)

export const CalendarIllo = () => (
  <svg viewBox="0 0 220 170" className="illo" aria-hidden="true">
    <path d="M24 90c0-45 40-70 92-68s84 28 80 72-44 66-92 62-80-22-80-66z" fill="#E9F9EF" />
    <rect x="46" y="38" width="112" height="104" rx="16" fill="#fff" {...s} />
    <path d="M46 70h112" {...s} />
    <rect x="46" y="38" width="112" height="32" rx="16" fill={GREEN} {...s} />
    <path d="M74 30v18M130 30v18" {...s} strokeWidth="5" />
    {[0, 1, 2, 3].map((c) =>
      [0, 1].map((r) => (
        <rect key={`${c}${r}`} x={60 + c * 23} y={82 + r * 24} width="16" height="16" rx="5" fill={c === 2 && r === 0 ? SUN : '#F2F4F3'} stroke={c === 2 && r === 0 ? INK : 'none'} strokeWidth="2.5" />
      ))
    )}
    <circle cx="164" cy="122" r="24" fill={SUN} {...s} />
    <path d="M164 108v14l9 6" {...s} />
    <path d="M30 46l6 6M28 60h8M188 50l6-6" {...s} strokeWidth="2.5" stroke={CORAL} />
  </svg>
)

export const DoneIllo = () => (
  <svg viewBox="0 0 220 170" className="illo" aria-hidden="true">
    <path d="M28 100c-6-44 34-78 84-76s86 34 80 74-42 62-90 60-68-18-74-58z" fill="#FFEDE3" />
    <path d="M52 84 100 46l48 38v58H52z" fill="#fff" {...s} />
    <path d="M40 92 100 44l60 48" {...s} strokeWidth="5" />
    <rect x="86" y="106" width="28" height="36" rx="4" fill={GREEN} {...s} />
    <rect x="62" y="96" width="18" height="16" rx="3" fill="#BDE8CF" {...s} strokeWidth="2.5" />
    <rect x="120" y="96" width="18" height="16" rx="3" fill="#BDE8CF" {...s} strokeWidth="2.5" />
    <circle cx="166" cy="58" r="22" fill={SUN} {...s} />
    <text x="166" y="66" textAnchor="middle" fontSize="22" fontWeight="800" fill={INK} fontFamily="Plus Jakarta Sans, sans-serif">₹</text>
    <circle cx="160" cy="128" r="18" fill={GREEN} {...s} />
    <path d="m152 128 6 6 10-11" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30 140h150" {...s} />
  </svg>
)

export const Squiggle = () => (
  <svg viewBox="0 0 200 18" className="squiggle" preserveAspectRatio="none" aria-hidden="true">
    <path d="M3 12c20-8 34-8 50 0s32 8 48 0 32-8 48 0 30 6 48-2" fill="none" stroke="#FFC93C" strokeWidth="6" strokeLinecap="round" />
  </svg>
)

export const EmptyIllo = () => (
  <svg viewBox="0 0 220 160" className="illo" aria-hidden="true">
    <path d="M30 90c-4-40 34-68 82-66s82 28 78 66-40 60-86 58-70-18-74-58z" fill={CREAM} />
    <rect x="62" y="64" width="96" height="62" rx="10" fill={CORAL} {...s} />
    <path d="M90 64v-8a8 8 0 0 1 8-8h24a8 8 0 0 1 8 8v8" fill="none" {...s} />
    <path d="M62 90h96" {...s} />
    <rect x="102" y="84" width="16" height="14" rx="3" fill={SUN} {...s} strokeWidth="2.5" />
    <path d="M170 40c6 0 10 4 10 9s-6 7-6 12M174 70v1" {...s} stroke={GREEN} />
  </svg>
)
