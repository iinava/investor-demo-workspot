const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

const Svg = ({ size = 20, children, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...p}>
    {children}
  </svg>
)

export const SearchIcon = (p) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>
export const PinIcon = (p) => <Svg {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></Svg>
export const ChevronDown = (p) => <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>
export const ChevronRight = (p) => <Svg {...p}><path d="m9 6 6 6-6 6" /></Svg>
export const ChevronLeft = (p) => <Svg {...p}><path d="m15 6-6 6 6 6" /></Svg>
export const ArrowRight = (p) => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>
export const CloseIcon = (p) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>
export const CheckIcon = (p) => <Svg {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Svg>
export const ClockIcon = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>
export const ShieldIcon = (p) => <Svg {...p}><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3z" /><path d="m9 12 2 2 4-4" /></Svg>
export const WalletIcon = (p) => <Svg {...p}><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M16 13h2M3 10h18M6 6V5a2 2 0 0 1 2-2h9" /></Svg>
export const TagIcon = (p) => <Svg {...p}><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9z" /><circle cx="8" cy="8" r="1.5" /></Svg>
export const BagIcon = (p) => <Svg {...p}><rect x="4" y="7" width="16" height="13" rx="3" /><path d="M9 7V5a3 3 0 0 1 6 0v2" /></Svg>
export const PhoneIcon = (p) => <Svg {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Svg>
export const HomeIcon = (p) => <Svg {...p}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5z" /></Svg>
export const CalendarIcon = (p) => <Svg {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /></Svg>
export const SparkIcon = (p) => <Svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></Svg>
export const UserIcon = (p) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></Svg>

export const Star = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2.8 14.8 8.6l6.3.8-4.6 4.4 1.2 6.3L12 17l-5.7 3.1 1.2-6.3L2.9 9.4l6.3-.8L12 2.8z" />
  </svg>
)

export const LogoMark = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="18" fill="#0F9D58" />
    <path d="M32 52s-15-12.6-15-24.5a15 15 0 0 1 30 0C47 39.4 32 52 32 52z" fill="#fff" />
    <circle cx="32" cy="27.5" r="7" fill="#FFC93C" />
  </svg>
)

export const Logo = ({ light = false }) => (
  <span className={`logo ${light ? 'logo--light' : ''}`}>
    <LogoMark />
    <span className="logo__word">workers<b>spot</b></span>
  </span>
)

export const EditIcon = (p) => <Svg {...p}><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="m13.5 6.5 4 4" /></Svg>
export const TrashIcon = (p) => <Svg {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></Svg>
export const PlusIcon = (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>
export const GridIcon = (p) => <Svg {...p}><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></Svg>
export const ListIcon = (p) => <Svg {...p}><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></Svg>
export const UsersIcon = (p) => <Svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2 .6 3.2 2.5 3.5 5.5" /></Svg>
export const BriefcaseIcon = (p) => <Svg {...p}><rect x="3" y="7" width="18" height="13" rx="3" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12.5h18" /></Svg>
export const LayersIcon = (p) => <Svg {...p}><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5" /></Svg>
export const CardIcon = (p) => <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h4" /></Svg>
export const SettingsIcon = (p) => <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></Svg>
export const LogoutIcon = (p) => <Svg {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4" /></Svg>
export const TrendIcon = (p) => <Svg {...p}><path d="m3 17 6-6 4 4 8-8M15 7h6v6" /></Svg>
export const MenuIcon = (p) => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>
export const NavIcon = (p) => <Svg {...p}><path d="m3 11 18-8-8 18-2-8-8-2z" /></Svg>
export const KeyIcon = (p) => <Svg {...p}><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M17 6l3 3" /></Svg>
export const RefreshIcon = (p) => <Svg {...p}><path d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4" /></Svg>
export const ExternalIcon = (p) => <Svg {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></Svg>
