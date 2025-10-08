import { NavLink } from 'react-router-dom'
import '../styles/navbar.css'


export default function NavBar() {
  const link = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? ' active' : ''}`

  return (
    <nav className="navbar">
      <div className="navbar-brand">Gestão de Usuários</div>
      <div className="navbar-links">
        <NavLink to="/" end className={link}>Dashboard</NavLink>
        <NavLink to="/users" end className={link}>Usuários</NavLink>
        <NavLink to="/users/new" className={link}>Novo</NavLink>
      </div>
    </nav>
  )
}
