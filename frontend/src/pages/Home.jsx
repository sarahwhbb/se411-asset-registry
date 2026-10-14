import { Link } from 'react-router-dom'
import { useAssets } from '../context/assetContextValue'
import { STATUSES } from '../data/assets'

export default function Home() {
  const { assets } = useAssets()

  return (
    <section>
      <div className="hero">
        <h1>Computer Asset Registry</h1>
        <p>Keep track of every computer your company owns: who has it, what state it is in, and what it cost.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/computers">
            View computers
          </Link>
          <Link className="btn" to="/add">
            + Add computer
          </Link>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-value">{assets.length}</span>
          <span className="stat-label">Total computers</span>
        </div>
        {STATUSES.map((status) => (
          <div className="stat" key={status}>
            <span className="stat-value">{assets.filter((a) => a.status === status).length}</span>
            <span className="stat-label">{status}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
