import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { getUser, createUser, updateUser } from '../api/userApi'
import '../styles/newser.css'

// Schema com saída garantida (active sempre boolean)
const schema = z.object({
  name: z.string().min(2, 'Informe o nome'),
  email: z.string().email('Email inválido'),
  role: z.string().min(2, 'Informe a função'),
  active: z.coerce.boolean().default(true),
})
type FormData = z.output<typeof schema>

export default function UserForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)

  // alguns combos de versões pedem cast do resolver
  const resolver = zodResolver(schema) as unknown as Resolver<FormData>

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver,
    defaultValues: { name: '', email: '', role: '', active: true },
  })

  // carregar para edição
  useEffect(() => {
    if (!id) return
    getUser(id).then(u => {
        setValue('name', u.name)
        setValue('email', u.email)
        setValue('role', u.role)
        setValue('active', !!u.active)
      }).catch((e) => {
        console.error(e)
        setApiError('Falha ao carregar usuário.')
      })
  }, [id, setValue])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setApiError(null)
    clearErrors()

    try {
      if (id) {
        await updateUser(id, data)
      } else {
        await createUser(data)
      }
      nav('/users')
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status
        const payload = err.response?.data as Record<string, unknown>

        // 400 de validação/regra de negócio
        if (status === 400) {
          if (payload?.['details'] && typeof payload['details'] === 'object') {
            Object.entries(payload['details'] as Record<string, unknown>).forEach(([field, message]) => {
              if (field in schema.shape) {
                setError(field as keyof FormData, { type: 'server', message: String(message) })
              }
            })
          }
          if (payload?.['message']) {
            const msg = String(payload['message'])
            if (/email/i.test(msg)) {
              setError('email', { type: 'server', message: msg })
            } else {
              setApiError(msg)
            }
            return
          }
        }

        if (status === 409 && payload?.['message']) {
          setError('email', { type: 'server', message: String(payload['message']) })
          return
        }

        const message =
          typeof payload?.['message'] === 'string'
            ? (payload['message'] as string)
            : 'Erro ao salvar. Tente novamente.'
        setApiError(message)
        return
      }

      setApiError('Erro inesperado. Tente novamente.')
    }
  }

  return (
    <div className="card">
      <h2>{id ? 'Editar Usuário' : 'Novo Usuário'}</h2>

      {apiError && (
        <div className="card" style={{ background: '#2a1b1b', borderColor: '#5e2a2a', marginBottom: 12 }}>
          <strong>Erro:</strong> {apiError}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nome</label>
          <input className="input" {...register('name')} />
          {errors.name && <small>{errors.name.message}</small>}
        </div>

        <div>
          <label>Email</label>
          <input className="input" {...register('email')} />
          {errors.email && <small>{errors.email.message}</small>}
        </div>

        <div>
          <label>Função</label>
          <select className="select" {...register('role')}>
            <option value="">Selecione…</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
          {errors.role && <small>{errors.role.message}</small>}
        </div>

        <div>
          <label>
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
