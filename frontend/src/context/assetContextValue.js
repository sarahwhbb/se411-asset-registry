import { createContext, useContext } from 'react'

export const AssetContext = createContext(null)

export function useAssets() {
  const ctx = useContext(AssetContext)
  if (!ctx) throw new Error('useAssets must be used inside <AssetProvider>')
  return ctx
}
