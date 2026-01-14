import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User } from '../types'
import { listAll, removeUser } from '../api/userApi'
import UserFilters from '../components/UserFilters'
import UsersTable from '../components/users/UsersTable'
import UsersCards from '../components/users/UsersCards'
import '../styles/user.css'

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const nav = useNavigate()

  const load = async () => {
    const data = await listAll()
    setUsers(data)
  }

  useEffect(() => {
    load()
  }, [])

  const onDelete = async (id?: number) => {
    if (!id) return
    if (!confirm('Remover este usuário?')) return
    await removeUser(id)
    await load()
  }

  return (
    <div className="card users-page">
      <div className="users-header">
        <h2>Usuários</h2>
        <Link to="/users/new" className="btn">
          Novo Usuário
        </Link>
      </div>

      <UserFilters onResults={setUsers} onResetAll={load} />

      {users.length === 0 ? (
        <div className="users-empty">Nenhum usuário encontrado.</div>
      ) : (
        <>
          {/* Desktop/Tablet */}
          <div className="only-desktop">
            <UsersTable users={users} onEdit={(id) => nav(`/users/${id}`)} onDelete={onDelete} />
          </div>

          {/* Mobile */}
          <div className="only-mobile">
            <UsersCards users={users} onEdit={(id) => nav(`/users/${id}`)} onDelete={onDelete} />
          </div>
        </>
      )}
    </div>
  )
}
