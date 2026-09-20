import { useCallback, useEffect, useState } from 'react'

/** Runs an async loader, and re-runs it on demand. */
export default function useAsync(loader, deps = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(loader, deps)

  useEffect(() => {
    let live = true
    setLoading(true)
    setError(null)
    run()
      .then((d) => live && setData(d))
      .catch((e) => live && setError(e.message || 'Something went wrong.'))
      .finally(() => live && setLoading(false))
    return () => {
      live = false
    }
  }, [run, tick])

  return { data, error, loading, reload: () => setTick((t) => t + 1) }
}
