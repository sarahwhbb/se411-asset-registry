import { Link } from 'react-router-dom'
import { useAssets } from '../context/assetContextValue'

export default function AssetList() {
  const { assets, deleteAsset } = useAssets()

  const handleDelete = (asset) => {
    if (window.confirm(`Delete ${asset.assetTag} (${asset.brand} ${asset.model})?`)) {
      deleteAsset(asset.id)
    }
  }

  return (
    <section>
      <div className="page-header">
        <h1>Computers</h1>
        <Link className="btn btn-primary" to="/add">
          + Add Computer
        </Link>
      </div>

      {assets.length === 0 ? (
        <p className="empty">No computers registered yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tag</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Serial #</th>
                <th>Purchased</th>
                <th>Status</th>
                <th>Assigned to</th>
                <th>Price (SAR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id}>
                  <td data-label="Tag">{a.assetTag}</td>
                  <td data-label="Brand">{a.brand}</td>
                  <td data-label="Model">{a.model}</td>
                  <td data-label="Serial #">{a.serialNumber}</td>
                  <td data-label="Purchased">{a.purchaseDate}</td>
                  <td data-label="Status">
                    <span className={`badge badge-${a.status.replace(/\s+/g, '-').toLowerCase()}`}>
                      {a.status}
                    </span>
                  </td>
                  <td data-label="Assigned to">{a.assignedTo || '—'}</td>
                  <td data-label="Price (SAR)">{a.price.toLocaleString()}</td>
                  <td className="actions">
                    <Link className="btn" to={`/edit/${a.id}`}>
                      Edit
                    </Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(a)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
