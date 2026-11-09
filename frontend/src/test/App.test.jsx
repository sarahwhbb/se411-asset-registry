import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { AssetProvider } from '../context/AssetContext'
import { validate } from '../utils/validate'

const seed = [
  { id: 1, assetTag: 'PC-0001', brand: 'Dell', model: 'Latitude', serialNumber: 'S1', purchaseDate: '2024-01-01', status: 'In use', assignedTo: 'Sara', price: 1000 },
  { id: 2, assetTag: 'PC-0002', brand: 'HP', model: 'EliteBook', serialNumber: 'S2', purchaseDate: '2024-02-02', status: 'In stock', assignedTo: '', price: 2000 },
]

const reply = (body, status = 200) =>
  Promise.resolve(new Response(body === null ? null : JSON.stringify(body), { status }))

// A tiny stand-in for the Spring backend: keeps assets in memory behind fetch.
const stubBackend = () => {
  let rows = seed.map((a) => ({ ...a }))
  let nextId = 100
  const fetchMock = vi.fn((url, options = {}) => {
    const id = Number(String(url).split('/').pop())
    switch (options.method ?? 'GET') {
      case 'POST': {
        const saved = { ...JSON.parse(options.body), id: nextId++ }
        rows.push(saved)
        return reply(saved, 201)
      }
      case 'PUT': {
        const saved = JSON.parse(options.body)
        rows = rows.map((a) => (a.id === id ? saved : a))
        return reply(saved)
      }
      case 'DELETE':
        rows = rows.filter((a) => a.id !== id)
        return reply(null, 204)
      default:
        return reply({ content: rows })
    }
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const renderApp = async (route = '/') => {
  render(
    <MemoryRouter initialEntries={[route]}>
      <AssetProvider>
        <App />
      </AssetProvider>
    </MemoryRouter>,
  )
  await waitFor(() => expect(fetch).toHaveBeenCalled())
  await screen.findByRole('contentinfo')
}

beforeEach(() => stubBackend())

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('navigation', () => {
  it('renders a footer on every page', async () => {
    await renderApp('/about')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('SE411')
  })

  it('shows the menu with an About item that opens the team page', async () => {
    await renderApp()
    await userEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByText('222411043')).toBeInTheDocument()
    expect(screen.getByText('Hatoon Alsolaim')).toBeInTheDocument()
  })
})

describe('home page', () => {
  it('shows the asset counts and links to the list', async () => {
    await renderApp()
    expect(screen.getByRole('heading', { name: 'Computer Asset Registry' })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('Total computers').previousSibling).toHaveTextContent('2'))
    await userEvent.click(screen.getByRole('link', { name: 'View computers' }))
    expect(screen.getByRole('heading', { name: 'Computers' })).toBeInTheDocument()
  })
})

describe('asset list', () => {
  it('displays every asset', async () => {
    await renderApp('/computers')
    expect(await screen.findByText('PC-0001')).toBeInTheDocument()
    expect(await screen.findByText('PC-0002')).toBeInTheDocument()
  })

  it('deletes an asset after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    await renderApp('/computers')
    const row = (await screen.findByText('PC-0001')).closest('tr')
    await userEvent.click(within(row).getByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(screen.queryByText('PC-0001')).not.toBeInTheDocument())
  })

  it('keeps the asset when deletion is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    await renderApp('/computers')
    const row = (await screen.findByText('PC-0001')).closest('tr')
    await userEvent.click(within(row).getByRole('button', { name: 'Delete' }))
    expect(screen.getByText('PC-0001')).toBeInTheDocument()
  })
})

describe('asset form', () => {
  it('shows validation errors and does not add when required fields are empty', async () => {
    await renderApp('/add')
    await userEvent.click(screen.getByRole('button', { name: 'Add computer' }))
    expect(screen.getByText('Asset tag is required')).toBeInTheDocument()
    expect(screen.getByText('Brand is required')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Add Computer' })).toBeInTheDocument()
  })

  it('adds a computer and returns to the list', async () => {
    await renderApp('/add')
    await userEvent.type(screen.getByLabelText('Asset tag *'), 'PC-0003')
    await userEvent.type(screen.getByLabelText('Brand *'), 'Lenovo')
    await userEvent.type(screen.getByLabelText('Model *'), 'ThinkPad')
    await userEvent.type(screen.getByLabelText('Serial number *'), 'S3')
    await userEvent.type(screen.getByLabelText('Purchase date *'), '2024-03-03')
    await userEvent.type(screen.getByLabelText('Price (SAR) *'), '1500')
    await userEvent.click(screen.getByRole('button', { name: 'Add computer' }))
    expect(await screen.findByRole('heading', { name: 'Computers' })).toBeInTheDocument()
    expect(await screen.findByText('PC-0003')).toBeInTheDocument()
  })

  it('edits an existing computer', async () => {
    await renderApp('/edit/1')
    const brand = await screen.findByLabelText('Brand *')
    expect(brand).toHaveValue('Dell')
    await userEvent.clear(brand)
    await userEvent.type(brand, 'Acer')
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(await screen.findByText('Acer')).toBeInTheDocument()
    expect(screen.queryByText('Dell')).not.toBeInTheDocument()
  })

  it('shows a message for an unknown id', async () => {
    await renderApp('/edit/999')
    expect(screen.getByText('Computer not found')).toBeInTheDocument()
  })
})

describe('when the backend is unavailable', () => {
  it('tells the user the list could not be loaded', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('fetch failed'))))
    render(
      <MemoryRouter initialEntries={['/computers']}>
        <AssetProvider>
          <App />
        </AssetProvider>
      </MemoryRouter>,
    )
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load/i)
  })

  it('stays on the form and shows an error when saving fails', async () => {
    await renderApp('/add')
    vi.stubGlobal('fetch', vi.fn(() => reply({ message: 'boom' }, 500)))
    await userEvent.type(screen.getByLabelText('Asset tag *'), 'PC-0003')
    await userEvent.type(screen.getByLabelText('Brand *'), 'Lenovo')
    await userEvent.type(screen.getByLabelText('Model *'), 'ThinkPad')
    await userEvent.type(screen.getByLabelText('Serial number *'), 'S3')
    await userEvent.type(screen.getByLabelText('Purchase date *'), '2024-03-03')
    await userEvent.type(screen.getByLabelText('Price (SAR) *'), '1500')
    await userEvent.click(screen.getByRole('button', { name: 'Add computer' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not save/i)
    expect(screen.getByRole('heading', { name: 'Add Computer' })).toBeInTheDocument()
  })
})

describe('validate', () => {
  const valid = { assetTag: 'PC-9', brand: 'a', model: 'b', serialNumber: 'c', purchaseDate: '2024-01-01', status: 'In use', assignedTo: '', price: '5' }

  it('accepts valid values', () => {
    expect(validate(valid, seed, null)).toEqual({})
  })

  it('rejects duplicate tags but allows the asset being edited', () => {
    expect(validate({ ...valid, assetTag: 'pc-0001' }, seed, null).assetTag).toMatch(/unique/)
    expect(validate({ ...valid, assetTag: 'PC-0001' }, seed, 1)).toEqual({})
  })

  it('rejects future dates and non-positive prices', () => {
    expect(validate({ ...valid, purchaseDate: '2999-01-01' }, seed, null).purchaseDate).toBeDefined()
    expect(validate({ ...valid, price: '0' }, seed, null).price).toBeDefined()
  })
})
