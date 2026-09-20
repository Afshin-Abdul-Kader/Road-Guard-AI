import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import { SeverityBadge } from '../components/Badge'
import { Scanner, ErrorNote } from '../components/Ui'

/** Detection comes entirely from the backend. Nothing is judged here. */
export default function AiResult({ go, params }) {
  const { file } = params
  const [detection, setDetection] = useState(null)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => url && URL.revokeObjectURL(url), [url])

  useEffect(() => {
    let live = true
    setError(null)
    setDetection(null)
    api
      .detect(file)
      .then((d) => live && setDetection(d))
      .catch((e) => live && setError(e.message || 'Detection failed.'))
    return () => {
      live = false
    }
  }, [file, attempt])

  if (error) {
    return (
      <>
        <ErrorNote error={error} onRetry={() => setAttempt((a) => a + 1)} />
        <button className="btn btn--quiet" onClick={() => go('public.photo', { file })}>
          Use a different photo
        </button>
      </>
    )
  }

  if (!detection) return <Scanner />

  const pct = Math.round((detection.confidence ?? 0) * 100)

  return (
    <>
      <h1 className="page-title">AI detection</h1>
      <p className="lede">Checked against the ward's road damage model.</p>

      <div className="card">
        {url && <img className="preview preview--sm" src={url} alt="The road damage you reported" />}

        <div style={{ marginTop: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div className="result__type">{detection.issue_type}</div>
          <SeverityBadge value={detection.severity} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--muted)' }}>Confidence</span>
            <strong>{pct}%</strong>
          </div>
          <div className="confidence">
            <i style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="btn-row">
          <button className="btn btn--primary" onClick={() => go('public.details', { file, detection })}>
            Continue
          </button>
          <button className="btn btn--quiet" onClick={() => go('public.photo', { file })}>
            That's not right — retake the photo
          </button>
        </div>
      </div>
    </>
  )
}
