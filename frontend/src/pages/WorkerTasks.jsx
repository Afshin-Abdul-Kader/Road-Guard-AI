import { api, WORKERS } from '../services/api'
import useAsync from '../useAsync'
import { SeverityBadge, StatusBadge } from '../components/Badge'
import { Scanner, ErrorNote } from '../components/Ui'

export default function WorkerTasks({ go, session, onChangeWorker }) {
  const { data, error, loading, reload } = useAsync(
    () => api.workerTasks(session.worker),
    [session.worker],
  )

  return (
    <>
      <h1 className="page-title">Today's work</h1>
      <p className="lede">Highest priority first.</p>

      <div className="field" style={{ maxWidth: '260px' }}>
        <label htmlFor="crew">Signed in as</label>

        <select
          id="crew"
          value={session.worker}
          onChange={(e) => onChangeWorker(e.target.value)}
        >
          {WORKERS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      <ErrorNote error={error} onRetry={reload} />

      {loading && (
        <Scanner
          title="Loading your tasks"
          note="Fetching assignments from the ward office."
        />
      )}

      {!loading && data?.tasks?.length === 0 && (
        <div className="card empty">
          Nothing assigned right now. New work will appear here as the
          councilor sends it.
        </div>
      )}

      {!loading &&
        data?.tasks?.map((task) => (
          <button
            key={task.id}
            className="rank-item"
            onClick={() =>
              go('worker.task', {
                taskId: task.id,
                reportId: task.report_id,
              })
            }
          >
            <span className="rank-item__body">
              <span className="rank-item__name">
                {task.issue_type} repair
              </span>

              <span className="rank-item__meta">
                {task.location}, {task.area}
              </span>

              <span
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '0.6rem',
                }}
              >
                <SeverityBadge value={task.priority} />
                <StatusBadge value={task.status} />
              </span>
            </span>

            <span className="btn btn--quiet btn--sm">
              View work
            </span>
          </button>
        ))}
    </>
  )
}