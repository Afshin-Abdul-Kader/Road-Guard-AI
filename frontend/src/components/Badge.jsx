const SEVERITY_CLASS = {
  CRITICAL: 'badge--critical',
  HIGH: 'badge--high',
  MEDIUM: 'badge--medium',
  LOW: 'badge--low',
}

const STATUS_CLASS = {
  REPORTED: 'badge--neutral',
  ASSIGNED: 'badge--medium',
  IN_PROGRESS: 'badge--high',
  COMPLETED: 'badge--done',
}

export function SeverityBadge({ value }) {
  if (!value) return null
  return <span className={`badge ${SEVERITY_CLASS[value] || 'badge--neutral'}`}>{value}</span>
}

export function StatusBadge({ value }) {
  if (!value) return null
  return (
    <span className={`badge ${STATUS_CLASS[value] || 'badge--neutral'}`}>
      {value.replace('_', ' ')}
    </span>
  )
}
