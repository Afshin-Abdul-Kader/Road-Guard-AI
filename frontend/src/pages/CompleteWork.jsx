import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import PhotoPicker from '../components/PhotoPicker'
import { ErrorNote } from '../components/Ui'

export default function CompleteWork({ go, params }) {
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState('')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => url && URL.revokeObjectURL(url), [url])

  async function submit() {
    setBusy(true)
    setError(null)
    try {
      const res = await api.completeTask(params.id, { file, description: description.trim() })
      setResult(res)
    } catch (e) {
      setError(e.message || 'Could not submit the completed work.')
    } finally {
      setBusy(false)
    }
  }

  if (result) {
    return (
      <div className="card">
        <div className="success__check" aria-hidden="true">
          ✓
        </div>
        <h1>Work completed</h1>
        <ul className="checklist">
          <li>✓ Ward councilor notified</li>
          <li>✓ Resident who reported it updated</li>
        </ul>
        <div className="btn-row">
          <button className="btn btn--primary" onClick={() => go('worker.tasks')}>
            Back to today's work
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <h1 className="page-title">Close this repair</h1>
      <p className="lede">A photo of the finished road is proof of work for the ward office.</p>

      <div className="card">
        <ErrorNote error={error} />

        {url ? (
          <img className="preview preview--sm" src={url} alt="The completed repair" />
        ) : (
          <div className="dropzone">Add a photo of the repaired stretch.</div>
        )}

        <PhotoPicker
          onPick={setFile}
          cameraLabel="📷 Take completion photo"
          uploadLabel="📁 Upload photo"
        />

        <div className="field" style={{ marginTop: '1.25rem' }}>
          <label htmlFor="work">What was done?</label>
          <textarea
            id="work"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Pothole filled with hot mix and levelled."
          />
        </div>

        <div className="btn-row">
          <button className="btn btn--primary" disabled={busy || !description.trim()} onClick={submit}>
            {busy ? 'Submitting…' : 'Submit completed work'}
          </button>
        </div>
      </div>
    </>
  )
}
