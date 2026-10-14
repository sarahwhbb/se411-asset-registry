import { useCallback, useMemo, useState } from 'react'
import { initialAssets } from '../data/assets'
import { AssetContext } from './assetContextValue'

export function AssetProvider({ children, initial = initialAssets }) {
  const [assets, setAssets] = useState(initial)

  const addAsset = useCallback((asset) => {
    setAssets((current) => {
      const nextId = current.reduce((max, a) => Math.max(max, a.id), 0) + 1
      return [...current, { ...asset, id: nextId }]
    })
  }, [])

  const updateAsset = useCallback((id, changes) => {
    setAssets((current) =>
      current.map((a) => (a.id === id ? { ...a, ...changes, id } : a)),
    )
  }, [])

  const deleteAsset = useCallback((id) => {
    setAssets((current) => current.filter((a) => a.id !== id))
  }, [])

  const getAsset = useCallback(
    (id) => assets.find((a) => a.id === id),
    [assets],
  )

  const value = useMemo(
    () => ({ assets, addAsset, updateAsset, deleteAsset, getAsset }),
    [assets, addAsset, updateAsset, deleteAsset, getAsset],
  )

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
}
