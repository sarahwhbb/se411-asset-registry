import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { AssetProvider } from '../context/AssetContext'
import { validate } from '../utils/validate'

const seed = [
  { id: 1, assetTag: 'PC-0001', brand: 'Dell', model: 'Latitude', serialNumber: 'S1', purchaseDate: '2024-01-01', status: 'In use', assignedTo: 'Sara', price: 1000 },
  { id: 2, assetTag: 'PC-0002', brand: 'HP', model: 'EliteBook', serialNumber: 'S2', purchaseDate: '2024-02-02', status: 'In stock', assignedTo: '', price: 2000 },
]

const renderApp = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <AssetProvider initial={seed}>
        <App />
      </AssetProvider>
    </MemoryRouter>,
  )

afterEach(() => vi.restoreAllMocks())

describe('navigation', () => {
  it('renders a footer on every page', () => {
    renderApp('/about')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('SE411')
  })

  it('shows the menu with an About item that opens the team page', async () => {
    renderApp()
    await userEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByText('222411043')).toBeInTheDocument()
    expect(screen.getByText('Hatoon Alsolaim')).toBeInTheDocument()
  })
})

describe('home page', () => {
  it('shows the asset counts and links to the list', async () => {
    renderApp()
    expect(screen.getByRole('heading', { name: 'Computer Asset Registry' })).toBeInTheDocument()
    expect(screen.getByText('Total computers').previousSibling).toHaveTextContent('2')
    await userEvent.click(screen.getByRole('link', { name: 'View computers' }))
    expect(screen.getByRole('heading', { name: 'Computers' })).toBeInTheDocument()
  })
})

describe('asset list', () => {
  it('displays every asset', () => {
    renderApp('/computers')
    expect(screen.getByText('PC-0001')).toBeInTheDocument()
    expect(screen.getByText('PC-0002')).toBeInTheDocument()
  })

  it('deletes an asset after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderApp('/computers')
    const row = screen.getByText('PC-0001').closest('tr')
    await userEvent.click(within(row).getByRole('button', { name: 'Delete' }))
    expect(screen.queryByText('PC-0001')).not.toBeInTheDocument()
  })

  it('keeps the asset when deletion is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderApp('/computers')
    const row = screen.getByText('PC-0001').closest('tr')
    await userEvent.click(within(row).getByRole('button', { name: 'Delete' }))
    expect(screen.getByText('PC-0001')).toBeInTheDocument()
  })
})

describe('asset form', () => {
  it('shows validation errors and does not add when required fields are empty', async () => {
    renderApp('/add')
    await userEvent.click(screen.getByRole('button', { name: 'Add computer' }))
    expect(screen.getByText('Asset tag is required')).toBeInTheDocument()
    expect(screen.getByText('Brand is required')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Add Computer' })).toBeInTheDocument()
  })

  it('adds a computer and returns to the list', async () => {
    renderApp('/add')
    await userEvent.type(screen.getByLabelText('Asset tag *'), 'PC-0003')
    await userEvent.type(screen.getByLabelText('Brand *'), 'Lenovo')
    await userEvent.type(screen.getByLabelText('Model *'), 'ThinkPad')
    await userEvent.type(screen.getByLabelText('Serial number *'), 'S3')
    await userEvent.type(screen.getByLabelText('Purchase date *'), '2024-03-03')
    await userEvent.type(screen.getByLabelText('Price (SAR) *'), '1500')
    await userEvent.click(screen.getByRole('button', { name: 'Add computer' }))
    expect(screen.getByRole('heading', { name: 'Computers' })).toBeInTheDocument()
    expect(screen.getByText('PC-0003')).toBeInTheDocument()
  })

  it('edits an existing computer', async () => {
    renderApp('/edit/1')
    const brand = screen.getByLabelText('Brand *')
    expect(brand).toHaveValue('Dell')
    await userEvent.clear(brand)
    await userEvent.type(brand, 'Acer')
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(screen.getByText('Acer')).toBeInTheDocument()
    expect(screen.queryByText('Dell')).not.toBeInTheDocument()
  })

  it('shows a message for an unknown id', () => {
    renderApp('/edit/999')
    expect(screen.getByText('Computer not found')).toBeInTheDocument()
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
