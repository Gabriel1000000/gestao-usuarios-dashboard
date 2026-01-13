import React, { useEffect, useMemo, useState } from 'react'
import { User, SystemRole } from '../types'
import { listAll, searchUsers } from '../api/userApi'
import '../styles/user.css'

type Props = {
  onResults: (users: User[]) => void
  onResetAll?: () => void | Promise<void>
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])

  return isMobile
}

export default function UserFilters({ onResults, onResetAll }: Props) {
  const isMobile = useIsMobile()

  // ✅ desktop: sempre aberto; mobile: fechado por padrão
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // quando alterna entre mobile/desktop, ajusta comportamento automaticamente
    if (isMobile) setOpen(false)
    else setOpen(true)
  }, [isMobile])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [systemRole, setSystemRole] = useState<SystemRole | ''>('')
  const [status, setStatus] = useState('') // "true" | "false" | ""

  const activeCount = useMemo(() => {
    let c = 0
    if (name.trim()) c++
    if (email.trim()) c++
    if (jobTitle.trim()) c++
    if (systemRole) c++
    if (status) c++
    return c
  }, [name, email, jobTitle, systemRole, status])

  const reset = async () => {
    setName('')
    setEmail('')
    setJobTitle('')
    setSystemRole('')
    setStatus('')

    if (onResetAll) await onResetAll()
    else onResults(await listAll())

    if (isMobile) setOpen(false)
  }

  const handleSearch = async () => {
    const active = status === '' ? undefined : status === 'true'

    const data = await searchUsers({
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      jobTitle: jobTitle.trim() || undefined,
      systemRole: systemRole || undefined,
      active,
    })

    onResults(data)

    if (isMobile) setOpen(false)
  }

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <section className={`filters ${isMobile ? 'is-mobile' : 'is-desktop'}`} aria-label="Filtros de usuários">
      {/* ✅ botão de toggle só no mobile */}
      {isMobile && (
        <button
          type="button"
          className="filters-toggle"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="filters-toggle__title">Filtros</span>
          <span className="filters-toggle__meta">
            {activeCount > 0 ? `${activeCount} ativo${activeCount > 1 ? 's' : ''}` : 'Nenhum ativo'}
          </span>
          <span className="filters-toggle__chev" aria-hidden="true">
            {open ? '▲' : '▼'}
          </span>
        </button>
      )}

      {/* ✅ desktop: sempre renderiza aberto; mobile: depende do open */}
      {(!isMobile || open) && (
        <div className={`filters-panel ${isMobile ? 'mobile' : 'desktop'}`} onKeyDown={onKeyDown}>
          <div className="filters-grid">
            <div className="filters-field">
              <label className="filters-label">Nome</label>
              <input
                className="input"
                placeholder="Ex.: Gabriel"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="filters-field">
              <label className="filters-label">E-mail</label>
              <input
                className="input"
                placeholder="Ex.: email@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="filters-field">
              <label className="filters-label">Cargo</label>
              <input
                className="input"
                placeholder="Ex.: Desenvolvedor"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="filters-field">
              <label className="filters-label">Perfil</label>
              <select className="select" value={systemRole} onChange={(e) => setSystemRole(e.target.value as any)}>
                <option value="">Todos</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="USER">USER</option>
              </select>
            </div>

            <div className="filters-field">
              <label className="filters-label">Status</label>
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>

          <div className="filters-actions">
            <button type="button" className="btn" onClick={handleSearch}>
              Buscar
            </button>
            <button type="button" className="btn secondary" onClick={reset}>
              Limpar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
