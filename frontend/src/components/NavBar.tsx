import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/navbar.css'

export default function NavBar() {
  const [open, setOpen] = useState(false)

  const link = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? ' active' : ''}`

  // Fecha o menu ao mudar o tamanho da tela para desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const closeMenu = () => setOpen(false)
  const toggleMenu = () => setOpen((v) => !v)

  return (
    <nav className="navbar">
      <div className="navbar-brand">Gestão de Usuários</div>

      {/* Desktop */}
      <div className="navbar-links navbar-links--desktop">
        <NavLink to="/" end className={link}>
          Dashboard
        </NavLink>
        <NavLink to="/users" end className={link}>
          Usuários
        </NavLink>
        <NavLink to="/users/new" className={link}>
          Novo
        </NavLink>
      </div>

      {/* Mobile button */}
      <button
        type="button"
        className="navbar-toggle"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        onClick={toggleMenu}
      >
        <i className={open ? 'bi bi-x-lg' : 'bi bi-list'} />
      </button>

      {/* Mobile dropdown */}
      <div className={`navbar-mobile ${open ? 'is-open' : ''}`}>
        <NavLink to="/" end className={link} onClick={closeMenu}>
          Dashboard
        </NavLink>
        <NavLink to="/users" end className={link} onClick={closeMenu}>
          Usuários
        </NavLink>
        <NavLink to="/users/new" className={link} onClick={closeMenu}>
          Novo
        </NavLink>
      </div>
    </nav>
  )
}
