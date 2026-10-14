import { STATUSES } from '../data/assets'

export function validate(values, assets, editingId) {
  const errors = {}
  const tag = values.assetTag.trim()

  if (!tag) errors.assetTag = 'Asset tag is required'
  else if (assets.some((a) => a.id !== editingId && a.assetTag.toLowerCase() === tag.toLowerCase()))
    errors.assetTag = 'Asset tag must be unique'

  if (!values.brand.trim()) errors.brand = 'Brand is required'
  if (!values.model.trim()) errors.model = 'Model is required'
  if (!values.serialNumber.trim()) errors.serialNumber = 'Serial number is required'

  if (!values.purchaseDate) errors.purchaseDate = 'Purchase date is required'
  else if (values.purchaseDate > new Date().toISOString().slice(0, 10))
    errors.purchaseDate = 'Purchase date cannot be in the future'

  if (!STATUSES.includes(values.status)) errors.status = 'Choose a valid status'

  if (values.price === '' || Number.isNaN(Number(values.price))) errors.price = 'Price is required'
  else if (Number(values.price) <= 0) errors.price = 'Price must be greater than 0'

  return errors
}
