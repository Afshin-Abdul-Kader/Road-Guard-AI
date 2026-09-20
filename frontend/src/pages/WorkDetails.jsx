import { useState } from 'react'
import { api } from '../services/api'
import useAsync from '../useAsync'
import RoadProgress from '../components/RoadProgress'
import { SeverityBadge, StatusBadge } from '../components/Badge'
import { Rows, Scanner, ErrorNote } from '../components/Ui'

export default function WorkDetails({ go, params }) {
 const reportId = params.reportId
const taskId = params.taskId

const { data, error, loading, reload } = useAsync(
  () => api.getReport(reportId),
  [reportId],
)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState(null)

  if (loading) return <Scanner title="Loading the job sheet" note={`Task ${params.id}`} />
  if (error) return <ErrorNote error={error} onRetry={reload} />

  async function start() {
    setBusy(true)
    setActionError(null)
    try {
      await api.updateTaskStatus(taskId, { status: 'IN_PROGRESS' })
      reload()
    } catch (e) {
      setActionError(e.message || 'Could not update the status.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h1 className="page-title">{data.issue_type} repair</h1>
      <p className="lede">
        {data.location}, {data.area}
      </p>

      <RoadProgress status={data.status} />

      <div className="card" style={{ marginTop: '1rem' }}>
        <ErrorNote error={actionError} />

        {data.image_url && (
          <img className="preview preview--sm" src={data.image_url} alt="Damage reported by a resident" />
        )}

        <Rows
          items={[
            ['Issue', data.issue_type],
            ['Road', data.location],
            ['Area', data.area],
            ['Priority', <SeverityBadge value={data.severity} />],
            ['Priority score', data.priority_score],
            ['Status', <StatusBadge value={data.status} />],
            ['Report ID', data.report_id],
          ]}
        />

        <div style={{ marginTop: '1rem' }}>
          <h3>What the resident reported</h3>
          <p style={{ color: 'var(--muted)', margin: '0.35rem 0 0' }}>
            {data.description || 'No extra details given.'}
          </p>
        </div>

        {data.status === 'COMPLETED' ? (
          <div className="btn-row">
            <button className="btn btn--quiet" onClick={() => go('worker.tasks')}>
              Back to today's work
            </button>
          </div>
        ) : (
          <div className="btn-row btn-row--split">
            <button
              className="btn btn--primary"
              disabled={busy || data.status === 'IN_PROGRESS'}
              onClick={start}
            >
              {data.status === 'IN_PROGRESS' ? 'Work started' : 'Start work'}
            </button>
            <button
              className="btn btn--ghost"
              disabled={data.status !== 'IN_PROGRESS'}
              onClick={() =>
  go('worker.complete', {
    id: taskId,
    reportId,
    issue: data,
  })
}
            >
              Mark completed
            </button>
          </div>
        )}
        {data.status === 'ASSIGNED' && (
          <p className="hint">Start the work before you can mark it completed.</p>
        )}
      </div>
    </>
  )
}
