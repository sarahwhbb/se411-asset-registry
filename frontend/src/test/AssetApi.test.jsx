import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AssetProvider } from '../context/AssetContext'
import { useAssets } from '../context/assetContextValue'

const API = 'http://localhost:8080/api/assets'

const computer = (id) => ({
  id,
  assetTag: `PC-${id}`,
  brand: 'Dell',
  model: 'Latitude',
  serialNumber: `S${id}`,
  purchaseDate: '2024-01-01',
  status: 'In use',
  assignedTo: '',
  price: 1000,
})

const json = (body, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }))

const setup = () =>
  renderHook(() => useAssets(), {
    wrapper: ({ children }) => <AssetProvider>{children}</AssetProvider>,
  })

afterEach(() => vi.unstubAllGlobals())

describe('useAssets against the REST API', () => {
  it('loads the list from the paged response content', async () => {
    const fetchMock = vi.fn(() => json({ content: [computer(1), computer(2)], totalPages: 1 }))
    vi.stubGlobal('fetch', fetchMock)

    const { result } = setup()

    await waitFor(() => expect(result.current.assets).toHaveLength(2))
    expect(result.current.getAsset(2).assetTag).toBe('PC-2')
    expect(fetchMock.mock.calls[0][0]).toBe(`${API}?page=0&size=1000`)
  })

  it('adds an asset by POSTing it and keeping the server-assigned id', async () => {
    const { id: _id, ...draft } = computer(0)
    const fetchMock = vi.fn((url, options) =>
      options?.method === 'POST' ? json({ ...draft, id: 7 }, 201) : json({ content: [] }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const { result } = setup()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    await act(() => result.current.addAsset(draft))

    const [url, options] = fetchMock.mock.calls.at(-1)
    expect(url).toBe(API)
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual(draft)
    expect(result.current.getAsset(7).assetTag).toBe('PC-0')
  })

  it('updates an asset by PUTting it and replacing it with the response', async () => {
    const fetchMock = vi.fn((url, options) =>
      options?.method === 'PUT'
        ? json({ ...computer(1), brand: 'HP' })
        : json({ content: [computer(1), computer(2)] }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const { result } = setup()
    await waitFor(() => expect(result.current.assets).toHaveLength(2))

    await act(() => result.current.updateAsset(1, { ...computer(1), brand: 'HP' }))

    const [url, options] = fetchMock.mock.calls.at(-1)
    expect(url).toBe(`${API}/1`)
    expect(options.method).toBe('PUT')
    expect(result.current.getAsset(1).brand).toBe('HP')
    expect(result.current.getAsset(2).brand).toBe('Dell')
  })

  it('deletes an asset with DELETE and removes it from the list', async () => {
    const fetchMock = vi.fn((url, options) =>
      options?.method === 'DELETE'
        ? Promise.resolve(new Response(null, { status: 204 }))
        : json({ content: [computer(1), computer(2)] }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const { result } = setup()
    await waitFor(() => expect(result.current.assets).toHaveLength(2))

    await act(() => result.current.deleteAsset(2))

    const [url, options] = fetchMock.mock.calls.at(-1)
    expect(url).toBe(`${API}/2`)
    expect(options.method).toBe('DELETE')
    expect(result.current.assets.map((a) => a.id)).toEqual([1])
  })
})
