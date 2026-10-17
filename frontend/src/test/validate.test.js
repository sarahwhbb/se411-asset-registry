import { describe, expect, it } from 'vitest'
import { validate } from '../utils/validate'

const assets = [
  { id: 1, assetTag: 'PC-0001', brand: 'Dell', model: 'Latitude', serialNumber: 'S1', purchaseDate: '2024-01-01', status: 'In use', assignedTo: '', price: 1000 },
  { id: 2, assetTag: 'PC-0002', brand: 'HP', model: 'EliteBook', serialNumber: 'S2', purchaseDate: '2024-02-02', status: 'In stock', assignedTo: '', price: 2000 },
]

const valid = {
  assetTag: 'PC-0003',
  brand: 'Lenovo',
  model: 'ThinkPad',
  serialNumber: 'S3',
  purchaseDate: '2024-03-03',
  status: 'In stock',
  assignedTo: '',
  price: '1500',
}

const isoDay = (offsetDays) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

describe('validate', () => {
  it('accepts valid values', () => {
    expect(validate(valid, assets, null)).toEqual({})
  })

  it('rejects a purchase date in the future', () => {
    const errors = validate({ ...valid, purchaseDate: isoDay(1) }, assets, null)
    expect(errors.purchaseDate).toMatch(/future/)
  })

  it('accepts today as the purchase date', () => {
    expect(validate({ ...valid, purchaseDate: isoDay(0) }, assets, null).purchaseDate).toBeUndefined()
  })

  it.each(['0', '-5', 0, -0.01])('rejects a price of %s', (price) => {
    expect(validate({ ...valid, price }, assets, null).price).toMatch(/greater than 0/)
  })

  it('rejects an empty or non-numeric price', () => {
    expect(validate({ ...valid, price: '' }, assets, null).price).toMatch(/required/)
    expect(validate({ ...valid, price: 'abc' }, assets, null).price).toMatch(/required/)
  })

  it('rejects a duplicate asset tag regardless of case or surrounding spaces', () => {
    expect(validate({ ...valid, assetTag: 'pc-0001' }, assets, null).assetTag).toMatch(/unique/)
    expect(validate({ ...valid, assetTag: ' Pc-0002 ' }, assets, null).assetTag).toMatch(/unique/)
  })

  it('lets an asset keep its own tag when editing, in any casing', () => {
    expect(validate({ ...valid, assetTag: 'PC-0001' }, assets, 1)).toEqual({})
    expect(validate({ ...valid, assetTag: 'pc-0001' }, assets, 1)).toEqual({})
  })

  it("still rejects another asset's tag when editing", () => {
    expect(validate({ ...valid, assetTag: 'PC-0002' }, assets, 1).assetTag).toMatch(/unique/)
  })

  it('requires the text fields and a valid status', () => {
    const errors = validate(
      { ...valid, assetTag: ' ', brand: '', model: '', serialNumber: '', purchaseDate: '', status: 'Lost' },
      assets,
      null,
    )
    expect(Object.keys(errors).sort()).toEqual(
      ['assetTag', 'brand', 'model', 'purchaseDate', 'serialNumber', 'status'].sort(),
    )
  })
})
