import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User } from '../types'
import { listAll, removeUser } from '../api/userApi'
import UserFilters from '../components/UserFilters'
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

      {/* filtros (mantém sua lógica de onResults/onResetAll) */}
      <UserFilters onResults={setUsers} onResetAll={load} />

      {users.length === 0 ? (
        <div className="users-empty">Nenhum usuário encontrado.</div>
      ) : (
        <>
          {/* TABELA (desktop / tablets) */}
          <div
            className="table-responsive users-table-wrap"
            role="region"
            aria-label="Tabela de usuários"
            tabIndex={0}
          >
            <table className="table users-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Cargo</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.jobTitle}</td>
                    <td>{u.systemRole}</td>
                    <td><span className={`badge ${u.active ? 'badge-ok' : 'badge-danger'}`}>
                        {u.active ? 'Ativo' : 'Inativo'}
                      </span></td>
                    <td>
                      <div className="row-actions">
                        <button className="btn secondary" onClick={() => nav(`/users/${u.id}`)}>
                          Editar
                        </button>
                        <button className="btn danger" onClick={() => onDelete(u.id)}>
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARDS (mobile) */}
          <div className="users-cards" aria-label="Lista de usuários (cards)">
            {users.map((u) => (
              <article className="user-card" key={u.id}>
                <header className="user-card__header">
                  <h3 className="user-card__title">{u.name}</h3>
                  <span className={`badge ${u.active ? 'badge-ok' : 'badge-danger'}`}>
                    {u.active ? 'Ativo' : 'Inativo'}
                  </span>
                </header>

                <div className="user-card__body">
                  <p>
                    <strong>E-mail:</strong> {u.email}
                  </p>
                  <p>
                    <strong>Cargo:</strong> {u.jobTitle}
                  </p>
                  <p>
                    <strong>Perfil:</strong> {u.systemRole}
                  </p>
                </div>

                <footer className="user-card__footer">
                  <button className="btn secondary btn-block" onClick={() => nav(`/users/${u.id}`)}>
                    Editar
                  </button>
                  <button className="btn danger btn-block" onClick={() => onDelete(u.id)}>
                    Excluir
                  </button>
                </footer>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
