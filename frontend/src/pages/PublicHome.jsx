import { useState } from 'react'
import PhotoPicker from '../components/PhotoPicker'

export default function PublicHome({ go }) {
  const [trackId, setTrackId] = useState('')

  return (
    <>
      <h1 className="page-title">Welcome to RoadGuard AI</h1>
      <p className="lede">
        See a pothole, crack or broken road? Send a photo. The ward office gets it straight away.
      </p>

      <div className="card">
        <h2>Report a road problem</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 0 }}>
          Stand at a safe distance and take one clear photo of the damage.
        </p>
        <PhotoPicker onPick={(file) => go('public.photo', { file })} />
      </div>

      <div className="card">
        <h3>Already reported something?</h3>
        <div className="field" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          <label htmlFor="track">Report ID</label>
          <input
            id="track"
            placeholder="RG-1042"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value.toUpperCase())}
          />
          <p className="hint">Printed on your confirmation screen.</p>
        </div>
        <div className="btn-row">
          <button
            className="btn btn--quiet"
            disabled={!trackId.trim()}
            onClick={() => go('public.status', { id: trackId.trim() })}
          >
            Check repair status
          </button>
        </div>
      </div>
    </>
  )
}
