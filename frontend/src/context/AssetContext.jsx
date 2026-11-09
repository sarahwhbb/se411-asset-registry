import { useCallback, useEffect, useMemo, useState } from 'react'
import { AssetContext } from './assetContextValue'

const API = 'http://localhost:8080/api/assets'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

export function AssetProvider({ children, initial = [] }) {
  const [assets, setAssets] = useState(initial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}?page=0&size=1000`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json()
      })
      .then((page) => setAssets(page.content))
      .catch(() => setError('Could not load computers. Is the backend running on port 8080?'))
      .finally(() => setLoading(false))
  }, [])

  // Each mutation resolves to true on success; on failure it sets `error` and resolves to false.
  const request = useCallback(async (url, options, onSuccess, failure) => {
    try {
      const res = await fetch(url, options)
      if (!res.ok) throw new Error(String(res.status))
      onSuccess(res.status === 204 ? null : await res.json())
      setError('')
      return true
    } catch {
      setError(failure)
      return false
    }
  }, [])

  const addAsset = useCallback(
    (asset) =>
      request(
        API,
        { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(asset) },
        (saved) => setAssets((current) => [...current, saved]),
        'Could not save the computer.',
      ),
    [request],
  )

  const updateAsset = useCallback(
    (id, changes) =>
      request(
        `${API}/${id}`,
        { method: 'PUT', headers: JSON_HEADERS, body: JSON.stringify({ ...changes, id }) },
        (saved) => setAssets((current) => current.map((a) => (a.id === id ? saved : a))),
        'Could not save the computer.',
      ),
    [request],
  )

  const deleteAsset = useCallback(
    (id) =>
      request(
        `${API}/${id}`,
        { method: 'DELETE' },
        () => setAssets((current) => current.filter((a) => a.id !== id)),
        'Could not delete the computer.',
      ),
    [request],
  )

  const getAsset = useCallback(
    (id) => assets.find((a) => a.id === id),
    [assets],
  )

  const value = useMemo(
    () => ({ assets, loading, error, addAsset, updateAsset, deleteAsset, getAsset }),
    [assets, loading, error, addAsset, updateAsset, deleteAsset, getAsset],
  )

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
}
