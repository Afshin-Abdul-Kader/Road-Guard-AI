import { api } from '../services/api'
import useAsync from '../useAsync'
import IssueMap from '../components/IssueMap'
import { SeverityBadge, StatusBadge } from '../components/Badge'
import { StatCard, Scanner, ErrorNote } from '../components/Ui'

export default function CouncilorDashboard({ go }) {
  const { data, error, loading, reload } = useAsync(() => api.councilorDashboard(), [])

  if (loading) return <Scanner title="Loading ward data" note="Gathering reports, crews and priorities." />
  if (error) return <ErrorNote error={error} onRetry={reload} />

  const { stats, priority_roads: roads = [], recently_completed: done = [] } = data

  return (
    <>
      <h1 className="page-title">Ward councilor dashboard</h1>
      <p className="lede">Ward 142 · updated just now</p>

      <div className="grid grid--4">
        <StatCard value={stats.critical} label="Critical issues" tone="critical" />
        <StatCard value={stats.high} label="High priority" tone="high" />
        <StatCard value={stats.in_progress} label="In progress" tone="progress" />
        <StatCard value={stats.completed} label="Completed" tone="done" />
      </div>

      <div className="section-head">
        <h2>Where the damage is</h2>
        <span className="hint">Tap a marker for details</span>
      </div>
      <IssueMap issues={roads} />

      <div className="section-head">
        <h2>Highest priority roads</h2>
        <button className="linkbtn" onClick={reload}>
          Refresh
        </button>
      </div>

      {roads.length === 0 && <div className="card empty">No open issues in the ward.</div>}

      {roads.map((issue, i) => (
        <button
          key={issue.report_id}
          className="rank-item"
          onClick={() => go('councilor.issue', { id: issue.report_id })}
        >
          <span className="rank-item__rank">{i + 1}</span>
          <span className="rank-item__body">
            <span className="rank-item__name">{issue.location}</span>
            <span className="rank-item__meta">
              {issue.issue_type} · {issue.area} · fix in {issue.expected_fix_days} days
            </span>
            <span style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
              <SeverityBadge value={issue.severity} />
              <StatusBadge value={issue.status} />
              {issue.assigned_worker && (
                <span className="hint" style={{ marginTop: 0 }}>
                  {issue.assigned_worker}
                </span>
              )}
            </span>
          </span>
          <span className="rank-item__score">
            <b>{issue.priority_score}</b>
            <small>priority</small>
          </span>
        </button>
      ))}

      {done.length > 0 && (
        <>
          <div className="section-head">
            <h2>Recently completed</h2>
          </div>
          {done.map((issue) => (
            <button
              key={issue.report_id}
              className="rank-item"
              onClick={() => go('councilor.issue', { id: issue.report_id })}
            >
              <span className="rank-item__body">
                <span className="rank-item__name">{issue.location}</span>
                <span className="rank-item__meta">
                  {issue.issue_type} · {issue.area} · closed by {issue.assigned_worker}
                </span>
              </span>
              <StatusBadge value={issue.status} />
            </button>
          ))}
        </>
      )}
    </>
  )
}
