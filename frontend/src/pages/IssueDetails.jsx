import { useState } from 'react'
import { api, WORKERS } from '../services/api'
import useAsync from '../useAsync'
import RoadProgress from '../components/RoadProgress'
import { SeverityBadge, StatusBadge } from '../components/Badge'
import { Rows, Scanner, ErrorNote } from '../components/Ui'

export default function IssueDetails({ params }) {
  const { data, error, loading, reload } = useAsync(
    () => api.getReport(params.id),
    [params.id],
  )

  const [worker, setWorker] = useState(WORKERS[0])
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState(null)

  if (loading) {
    return (
      <Scanner
        title="Loading issue"
        note={`Report ${params.id}`}
      />
    )
  }

  if (error) return <ErrorNote error={error} onRetry={reload} />

  async function assign() {
    setBusy(true)
    setActionError(null)

    try {
      await api.assignTask(data.id, worker)
      await reload()
    } catch (e) {
      setActionError(
        e.message || 'Could not assign the worker.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h1 className="page-title">{data.issue_type}</h1>

      <p className="lede">
        {data.location}, {data.area}
      </p>

      <RoadProgress status={data.status} />

      <div className="card" style={{ marginTop: '1rem' }}>
        {data.image_url && (
          <img
            className="preview"
            src={data.image_url}
            alt="Reported road damage"
          />
        )}

        <Rows
          items={[
            ['Problem', data.issue_type],
            ['Area', data.area],
            ['Road', data.location],
            [
              'Severity',
              <SeverityBadge value={data.severity} />,
            ],
            ['Priority score', data.priority_score],
            [
              'Status',
              <StatusBadge value={data.status} />,
            ],
            [
              'Estimated fix time',
              `${data.estimated_fix_days ?? '—'} days`,
            ],
            [
              'Assigned to',
              data.worker_name || 'Not assigned',
            ],
          ]}
        />

        {data.description && (
          <p
            style={{
              color: 'var(--muted)',
              marginTop: '1rem',
            }}
          >
            {data.description}
          </p>
        )}
      </div>

      {data.status === 'COMPLETED' ? (
        <div className="card">
          <h3>Repair record</h3>

          <p style={{ color: 'var(--muted)' }}>
            {data.completion?.description ||
              'Closed by the repair crew.'}
          </p>

          {data.completion?.image_url && (
            <img
              className="preview preview--sm"
              src={data.completion.image_url}
              alt="Completed repair"
            />
          )}
        </div>
      ) : (
        <div className="card">
          <h3>
            {data.status === 'REPORTED'
              ? 'Assign a worker'
              : 'Reassign this job'}
          </h3>

          <ErrorNote error={actionError} />

          <div
            className="field"
            style={{ marginTop: '0.75rem' }}
          >
            <label htmlFor="worker">
              Repair crew
            </label>

            <select
              id="worker"
              value={worker}
              onChange={(e) =>
                setWorker(e.target.value)
              }
            >
              {WORKERS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div className="btn-row">
            <button
              className="btn btn--primary"
              disabled={busy}
              onClick={assign}
            >
              {busy
                ? 'Assigning…'
                : `Assign ${worker}`}
            </button>
          </div>
        </div>
      )}
    </>
  )
}