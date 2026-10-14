import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/computers', label: 'Computers' },
  { to: '/add', label: 'Add Computer' },
  { to: '/about', label: 'About' },
]

export default function NavBar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <span className="navbar-brand">SE411 Asset Registry</span>
      <ul className="navbar-links">
        {links.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink to={to} end={end}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
