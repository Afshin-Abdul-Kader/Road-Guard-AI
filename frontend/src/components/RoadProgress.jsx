const STEPS = ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED']
const LABELS = {
  REPORTED: 'REPORTED',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN PROGRESS',
  COMPLETED: 'COMPLETED',
}

/** The repair journey, drawn as a road with lane markings. */
export default function RoadProgress({ status }) {
  const current = Math.max(0, STEPS.indexOf(status))

  return (
    <div className="road" role="group" aria-label="Repair progress">
      <div className="road__lane" aria-hidden="true" />
      <div className="road__steps">
        {STEPS.map((step, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'todo'
          return (
            <div key={step} className={`road__step road__step--${state}`}>
              <div className="road__dot" />
              <div className="road__label">{LABELS[step]}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
