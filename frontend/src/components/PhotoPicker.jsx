import { useRef } from 'react'

/**
 * Two ways in: the phone camera (capture attribute, supported on mobile
 * browsers) and the file picker. Both hand back a File.
 */
export default function PhotoPicker({ onPick, cameraLabel = '📷 Take photo', uploadLabel = '📁 Upload photo' }) {
  const cameraRef = useRef(null)
  const uploadRef = useRef(null)

  const handle = (e) => {
    const file = e.target.files?.[0]
    if (file) onPick(file)
    e.target.value = ''
  }

  return (
    <>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handle}
        hidden
      />
      <input ref={uploadRef} type="file" accept="image/*" onChange={handle} hidden />

      <div className="btn-row btn-row--split">
        <button className="btn btn--primary" onClick={() => cameraRef.current?.click()}>
          {cameraLabel}
        </button>
        <button className="btn btn--ghost" onClick={() => uploadRef.current?.click()}>
          {uploadLabel}
        </button>
      </div>
    </>
  )
}
