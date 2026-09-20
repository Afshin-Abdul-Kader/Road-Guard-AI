import { useState } from 'react'
import { api } from '../services/api'
import { ErrorNote } from '../components/Ui'

export default function ReportDetails({ go, params }) {
  const { file, detection } = params
  const [area, setArea] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const ready = area.trim() && location.trim()

  async function submit() {
    setSending(true)
    setError(null)
    try {
      const report = await api.createReport({
        file,
        area: area.trim(),
        location: location.trim(),
        description: description.trim(),
        detection,
      })
      go('public.success', { report })
    } catch (e) {
      setError(e.message || 'Could not submit the report.')
      setSending(false)
    }
  }

  return (
    <>
      <h1 className="page-title">Where is this problem?</h1>
      <p className="lede">The ward office uses this to send a repair crew to the right spot.</p>

      <div className="card">
        <ErrorNote error={error} />

        <div className="field">
          <label htmlFor="area">Area</label>
          <input
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Ramapuram"
          />
        </div>

        <div className="field">
          <label htmlFor="road">Road or landmark</label>
          <input
            id="road"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ramapuram Main Road, near the bus stop"
          />
        </div>

        <div className="field">
          <label htmlFor="notes">Anything else we should know?</label>
          <textarea
            id="notes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional. For example: water collects here every evening."
          />
        </div>

        <div className="btn-row">
          <button className="btn btn--primary" disabled={!ready || sending} onClick={submit}>
            {sending ? 'Submitting…' : 'Submit report'}
          </button>
        </div>
      </div>
    </>
  )
}
