import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAssets } from '../context/assetContextValue'
import { STATUSES } from '../data/assets'
import { validate } from '../utils/validate'

const emptyForm = {
  assetTag: '',
  brand: '',
  model: '',
  serialNumber: '',
  purchaseDate: '',
  status: 'In stock',
  assignedTo: '',
  price: '',
}

export default function AssetForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { assets, getAsset, addAsset, updateAsset } = useAssets()

  const editingId = id === undefined ? null : Number(id)
  const existing = editingId === null ? null : getAsset(editingId)

  const [values, setValues] = useState(existing ?? emptyForm)
  const [errors, setErrors] = useState({})

  if (editingId !== null && !existing) {
    return (
      <section>
        <h1>Computer not found</h1>
        <p>
          <Link to="/computers">Back to the list</Link>
        </p>
      </section>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(values, assets, editingId)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const clean = {
      ...values,
      assetTag: values.assetTag.trim(),
      brand: values.brand.trim(),
      model: values.model.trim(),
      serialNumber: values.serialNumber.trim(),
      assignedTo: values.assignedTo.trim(),
      price: Number(values.price),
    }

    if (editingId === null) addAsset(clean)
    else updateAsset(editingId, clean)
    navigate('/computers')
  }

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} value={values[name]} onChange={handleChange} {...props} />
      {errors[name] && (
        <span className="error" role="alert">
          {errors[name]}
        </span>
      )}
    </div>
  )

  return (
    <section>
      <h1>{editingId === null ? 'Add Computer' : `Edit ${existing.assetTag}`}</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field-grid">
        {field('assetTag', 'Asset tag *', { placeholder: 'PC-0007' })}
        {field('brand', 'Brand *')}
        {field('model', 'Model *')}
        {field('serialNumber', 'Serial number *')}
        {field('purchaseDate', 'Purchase date *', { type: 'date' })}

        <div className="field">
          <label htmlFor="status">Status *</label>
          <select id="status" name="status" value={values.status} onChange={handleChange}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.status && <span className="error">{errors.status}</span>}
        </div>

        {field('assignedTo', 'Assigned to')}
        {field('price', 'Price (SAR) *', { type: 'number', min: '0', step: '0.01' })}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId === null ? 'Add computer' : 'Save changes'}
          </button>
          <Link className="btn" to="/computers">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  )
}
