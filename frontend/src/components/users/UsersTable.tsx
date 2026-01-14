import { User } from '../../types'

type Props = {
  users: User[]
  onEdit: (id: number) => void
  onDelete: (id?: number) => void
}

export default function UsersTable({ users, onEdit, onDelete }: Props) {
  return (
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
              <td>
                <span className={`badge ${u.active ? 'badge-ok' : 'badge-danger'}`}>
                  {u.active ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td>
                <div className="row-actions">
                  <button className="btn secondary" onClick={() => onEdit(u.id!)}>
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
  )
}
