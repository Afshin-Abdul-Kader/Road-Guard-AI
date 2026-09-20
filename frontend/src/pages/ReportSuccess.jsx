import { SeverityBadge, StatusBadge } from '../components/Badge'
import { Rows } from '../components/Ui'

export default function ReportSuccess({ go, params }) {
  const r = params.report

  return (
    <>
      <div className="card">
        <div className="success__check" aria-hidden="true">
          ✓
        </div>
        <h1>Report submitted</h1>
        <p style={{ color: 'var(--muted)' }}>
          Save this ID. You can check the repair status with it any time.
        </p>

        <div className="ticket">{r.report_id}</div>

        <Rows
          items={[
            ['Problem', r.issue_type],
            ['Severity', <SeverityBadge value={r.severity} />],
            ['Area', r.area],
            ['Status', <StatusBadge value={r.status} />],
          ]}
        />

        <div className="btn-row">
          <button className="btn btn--primary" onClick={() => go('public.status', { id: r.report_id })}>
            View status
          </button>
          <button className="btn btn--quiet" onClick={() => go('public.home')}>
            Report something else
          </button>
        </div>
      </div>
    </>
  )
}
