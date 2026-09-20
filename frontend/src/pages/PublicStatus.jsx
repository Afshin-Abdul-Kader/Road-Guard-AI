import { api } from '../services/api'
import useAsync from '../useAsync'
import RoadProgress from '../components/RoadProgress'
import { SeverityBadge, StatusBadge } from '../components/Badge'
import { Rows, Scanner, ErrorNote } from '../components/Ui'

const MESSAGE = {
  REPORTED: 'Your report is with the ward office and waiting to be assigned.',
  ASSIGNED: 'A repair crew has been assigned to this road.',
  IN_PROGRESS: 'Work is under way on site.',
  COMPLETED: 'The repair is finished. Thank you for reporting it.',
}

export default function PublicStatus({ go, params }) {
  const { data, error, loading, reload } = useAsync(() => api.getReport(params.id), [params.id])

  if (loading) return <Scanner title="Looking up your report" note={`Report ${params.id}`} />
  if (error) {
    return (
      <>
        <ErrorNote error={error} onRetry={reload} />
        <button className="btn btn--quiet" onClick={() => go('public.home')}>
          Back to home
        </button>
      </>
    )
  }

  return (
    <>
      <h1 className="page-title">Report {data.report_id}</h1>
      <p className="lede">{MESSAGE[data.status]}</p>

      <RoadProgress status={data.status} />

      <div className="card" style={{ marginTop: '1rem' }}>
        {data.image_url && (
          <img className="preview preview--sm" src={data.image_url} alt="The reported road damage" />
        )}
        <Rows
          items={[
            ['Problem', data.issue_type],
            ['Road', data.location],
            ['Area', data.area],
            ['Severity', <SeverityBadge value={data.severity} />],
            ['Status', <StatusBadge value={data.status} />],
            ['Reported on', data.reported_at],
            [
  'Expected fix',
  data.status === 'COMPLETED' ? 'Done' : `${data.estimated_fix_days} days`,
],
          ]}
        />

        {data.completion && (
          <div style={{ marginTop: '1.25rem' }}>
            <h3>Repair record</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '0.75rem' }}>{data.completion.description}</p>
            {data.completion.image_url && (
              <img className="preview preview--sm" src={data.completion.image_url} alt="The completed repair" />
            )}
          </div>
        )}

        <div className="btn-row">
          <button className="btn btn--quiet" onClick={reload}>
            Refresh
          </button>
        </div>
      </div>
    </>
  )
}
