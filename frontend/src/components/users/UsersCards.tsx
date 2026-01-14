import { User } from '../../types'

type Props = {
  users: User[]
  onEdit: (id: number) => void
  onDelete: (id?: number) => void
}

export default function UsersCards({ users, onEdit, onDelete }: Props) {
  return (
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
            <button className="btn secondary btn-block" onClick={() => onEdit(u.id!)}>
              Editar
            </button>
            <button className="btn danger btn-block" onClick={() => onDelete(u.id)}>
              Excluir
            </button>
          </footer>
        </article>
      ))}
    </div>
  )
}
