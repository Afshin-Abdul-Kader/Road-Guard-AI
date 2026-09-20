import { useEffect, useMemo, useState } from 'react'
import PhotoPicker from '../components/PhotoPicker'

export default function PublicPhoto({ go, params }) {
  const [file, setFile] = useState(params.file || null)
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(() => () => url && URL.revokeObjectURL(url), [url])

  return (
    <>
      <h1 className="page-title">Check your photo</h1>
      <p className="lede">The damage should fill most of the frame and be in focus.</p>

      <div className="card">
        {url ? (
          <img className="preview" src={url} alt="The road damage you photographed" />
        ) : (
          <div className="dropzone">No photo selected yet.</div>
        )}

        <div className="btn-row">
          <button className="btn btn--primary" disabled={!file} onClick={() => go('public.result', { file })}>
            Analyse road
          </button>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <PhotoPicker
            onPick={setFile}
            cameraLabel="📷 Retake photo"
            uploadLabel="📁 Choose another"
          />
        </div>
      </div>
    </>
  )
}
