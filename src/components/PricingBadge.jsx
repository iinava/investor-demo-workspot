const LABELS = { fixed: 'Fixed rate', hourly: 'Per hour', daily: 'Per day', contract: 'Contract' }

export default function PricingBadge({ type, floating = false }) {
  return <span className={`pbadge pbadge--${type} ${floating ? 'pbadge--float' : ''}`}>{LABELS[type] ?? type}</span>
}
