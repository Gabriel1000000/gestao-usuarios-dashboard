import React, { useState } from 'react'
import { User } from '../types'
import { getByName, getByEmail, getByRole, getByActive, listAll } from '../api/userApi'
import { intersectManyById } from '../utils/intersect'
import '../styles/user.css'

type Props = {
  onResults: (users: User[]) => void
  onResetAll?: () => void | Promise<void>
}

export default function UserFilters({ onResults, onResetAll }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('') // "true" | "false" | ""

  const reset = async () => {
    setName('')
    setEmail('')
    setRole('')
    setStatus('')

    if (onResetAll) {
      await onResetAll()
    } else {
      onResults(await listAll())
    }
  }

  const handleSearch = async () => {
    const filters = {
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      status: status.trim(),
    }

    const active = Object.entries(filters).filter(([, v]) => v !== '')
    if (active.length === 0) {
      onResults(await listAll())
      return
    }
    if (active.length > 3) {
      alert('Selecione no máximo 3 filtros.')
      return
    }

    const calls: Promise<User[]>[] = active.map(([k, v]) => {
      if (k === 'name')   return getByName(String(v))
      if (k === 'email')  return getByEmail(String(v))
      if (k === 'role')   return getByRole(String(v))
      if (k === 'status') return getByActive(v === 'true')
      return Promise.resolve<User[]>([])
    })

    const results = await Promise.all(calls)
    const final = intersectManyById(results) 
    onResults(final)
  }

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
        <input
          className="input"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="input"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <select className="select" value={role} onChange={e => setRole(e.target.value)}>
          <option value="">Função</option>
          <option value="admin">admin</option>
          <option value="user">user</option>
        </select>
        <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Status</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="btn" onClick={handleSearch}>Buscar</button>
        <button className="btn secondary" onClick={reset}>Limpar</button>
      </div>

      <small style={{ color: '#888' }}>
        Use 1 filtro ou combine até <strong>3</strong>.
      </small>
    </div>
  )
}
