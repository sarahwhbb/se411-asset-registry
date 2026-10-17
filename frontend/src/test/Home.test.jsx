import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AssetProvider } from '../context/AssetContext'
import { STATUSES, initialAssets } from '../data/assets'
import Home from '../pages/Home'

const renderHome = () =>
  render(
    <MemoryRouter>
      <AssetProvider>
        <Home />
      </AssetProvider>
    </MemoryRouter>,
  )

const countFor = (label) => Number(screen.getByText(label).previousSibling.textContent)

describe('Home status counts', () => {
  it('shows the seed data total', () => {
    renderHome()
    expect(countFor('Total computers')).toBe(initialAssets.length)
  })

  it.each(STATUSES)('shows the seed data count for "%s"', (status) => {
    renderHome()
    expect(countFor(status)).toBe(initialAssets.filter((a) => a.status === status).length)
  })

  it('has status counts that add up to the total', () => {
    renderHome()
    const sum = STATUSES.reduce((n, s) => n + countFor(s), 0)
    expect(sum).toBe(countFor('Total computers'))
  })
})
