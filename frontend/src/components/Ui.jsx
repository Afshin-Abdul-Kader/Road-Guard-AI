export function Scanner({ title = 'Analysing the road surface', note = 'The AI model is reviewing your photo.' }) {
  return (
    <div className="card scanner" aria-live="polite">
      <h2>{title}</h2>
      <p style={{ color: 'var(--muted)', margin: '0.4rem auto 0' }}>{note}</p>
      <div className="scanner__bar">
        <i />
      </div>
    </div>
  )
}

export function StatCard({ value, label, tone = '' }) {
  return (
    <div className={`stat ${tone ? `stat--${tone}` : ''}`}>
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </div>
  )
}

export function Rows({ items }) {
  return (
    <dl className="rows">
      {items
        .filter(([, v]) => v !== null && v !== undefined && v !== '')
        .map(([k, v]) => (
          <div className="row" key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
    </dl>
  )
}

export function ErrorNote({ error, onRetry }) {
  if (!error) return null
  return (
    <div className="error" role="alert">
      {error}{' '}
      {onRetry && (
        <button className="linkbtn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
