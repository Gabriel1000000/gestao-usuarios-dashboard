import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { User } from '../types'
import '../styles/user.css'



export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const nav = useNavigate()

  const load = () => api.get<User[]>('/users').then(r => setUsers(r.data))
  useEffect(() => { load() }, [])

  const onDelete = async (id?: number) => {
    if (!id) return
    if (!confirm('Remover este usuário?')) return
    await api.delete(`/users/${id}`)
    await load()
  }

  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Usuários</h2>
        <Link to="/users/new" className="btn">Novo Usuário</Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th><th>Email</th><th>Função</th><th>Ativo</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.active ? 'Sim' : 'Não'}</td>
              <td>
                <div className="row-actions">
                  <button className="btn secondary" onClick={() => nav(`/users/${u.id}`)}>Editar</button>
                  <button className="btn danger" onClick={() => onDelete(u.id)}>Excluir</button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan={5}>Nenhum usuário encontrado.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
