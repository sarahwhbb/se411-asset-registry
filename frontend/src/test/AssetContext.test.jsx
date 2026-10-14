import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AssetProvider } from '../context/AssetContext'
import { useAssets } from '../context/assetContextValue'

const seed = [
  { id: 1, assetTag: 'PC-1', brand: 'A', model: 'M', serialNumber: 'S1', purchaseDate: '2024-01-01', status: 'In use', assignedTo: '', price: 10 },
  { id: 2, assetTag: 'PC-2', brand: 'B', model: 'N', serialNumber: 'S2', purchaseDate: '2024-01-02', status: 'In stock', assignedTo: '', price: 20 },
]

const setup = () =>
  renderHook(() => useAssets(), {
    wrapper: ({ children }) => <AssetProvider initial={seed}>{children}</AssetProvider>,
  })

describe('AssetContext', () => {
  it('adds an asset with the next id', () => {
    const { result } = setup()
    act(() => result.current.addAsset({ ...seed[0], assetTag: 'PC-3' }))
    expect(result.current.assets).toHaveLength(3)
    expect(result.current.getAsset(3).assetTag).toBe('PC-3')
  })

  it('updates an asset without changing its id', () => {
    const { result } = setup()
    act(() => result.current.updateAsset(1, { brand: 'Changed', id: 99 }))
    expect(result.current.getAsset(1).brand).toBe('Changed')
    expect(result.current.getAsset(99)).toBeUndefined()
  })

  it('deletes an asset', () => {
    const { result } = setup()
    act(() => result.current.deleteAsset(2))
    expect(result.current.assets.map((a) => a.id)).toEqual([1])
  })

  it('does not reuse the id of a deleted last item', () => {
    const { result } = setup()
    act(() => result.current.deleteAsset(2))
    act(() => result.current.addAsset({ ...seed[0], assetTag: 'PC-9' }))
    expect(result.current.assets.at(-1).id).toBe(2)
  })
})
