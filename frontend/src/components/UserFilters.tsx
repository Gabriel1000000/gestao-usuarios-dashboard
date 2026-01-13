import React, { useState } from 'react'
import { User, SystemRole } from '../types'
import { listAll, searchUsers } from '../api/userApi'
import '../styles/user.css'

type Props = {
  onResults: (users: User[]) => void
  onResetAll?: () => void | Promise<void>
}

export default function UserFilters({ onResults, onResetAll }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [systemRole, setSystemRole] = useState<SystemRole | ''>('')
  const [status, setStatus] = useState('') // "true" | "false" | ""

  const reset = async () => {
    setName('')
    setEmail('')
    setJobTitle('')
    setSystemRole('')
    setStatus('')

    if (onResetAll) await onResetAll()
    else onResults(await listAll())
  }

  const handleSearch = async () => {
    const active =
      status === '' ? undefined : status === 'true'

    const data = await searchUsers({
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      jobTitle: jobTitle.trim() || undefined,
      systemRole: systemRole || undefined,
      active
    })

    onResults(data)
  }

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8 }}>
        <input className="input" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
        <input className="input" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" placeholder="Cargo/Profissão" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />

        <select className="select" value={systemRole} onChange={e => setSystemRole(e.target.value as any)}>
          <option value="">Perfil (todos)</option>
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="USER">USER</option>
        </select>

        <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Status (todos)</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="btn" onClick={handleSearch}>Buscar</button>
        <button className="btn secondary" onClick={reset}>Limpar</button>
      </div>
    </div>
  )
}
