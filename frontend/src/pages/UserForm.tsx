import { useEffect } from 'react'
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { User } from '../types'

// Schema com saída garantida (active sempre boolean)
const schema = z.object({
  name: z.string().min(2, 'Informe o nome'),
  email: z.string().email('Email inválido'),
  role: z.string().min(2, 'Informe a função'),
  active: z.coerce.boolean().default(true),
})

// Use o tipo de SAÍDA do schema (após coerções)
type FormData = z.output<typeof schema>

export default function UserForm() {
  const { id } = useParams()
  const nav = useNavigate()

  // Alguns combos de versões pedem um cast do resolver para alinhar generics
  const resolver = zodResolver(schema) as unknown as Resolver<FormData>

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver,
    defaultValues: {
      name: '',
      email: '',
      role: '',
      active: true,
    },
  })

  useEffect(() => {
    if (!id) return
    api.get<User>(`/users/${id}`).then((r) => {
      const u = r.data
      setValue('name', u.name)
      setValue('email', u.email)
      setValue('role', u.role)
      setValue('active', !!u.active)
    })
  }, [id, setValue])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (id) {
      await api.put(`/users/${id}`, data)
    } else {
      await api.post('/users', data)
    }
    nav('/users')
  }

  return (
    <div className="card">
      <h2>{id ? 'Editar Usuário' : 'Novo Usuário'}</h2>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nome</label>
          <input className="input" {...register('name')} />
        </div>
        {errors.name && <small>{errors.name.message}</small>}

        <div>
          <label>Email</label>
          <input className="input" {...register('email')} />
        </div>
        {errors.email && <small>{errors.email.message}</small>}

        <div>
          <label>Função</label>
          <select className="select" {...register('role')}>
            <option value="">Selecione…</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        </div>
        {errors.role && <small>{errors.role.message}</small>}

        <div>
          <label>
            {/* sem valueAsBoolean; o z.coerce.boolean() já dá conta */}
            <input type="checkbox" {...register('active')} /> Ativo
          </label>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" disabled={isSubmitting} type="submit">
            {id ? 'Salvar' : 'Criar'}
          </button>
          <button className="btn secondary" type="button" onClick={() => nav(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
