import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { User } from '../types'
import { isAxiosError } from 'axios'
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
    setApiError(null)
    clearErrors() // limpa erros antigos

    try {
      if (id) {
        await api.put(`/users/${id}`, data)
      } else {
        await api.post('/users', data)
      }
      nav('/users')
    } catch (err) {
      // Trata respostas do backend
      if (isAxiosError(err)) {
        const status = err.response?.status
        const payload = err.response?.data as Record<string, unknown>;


        // 400 de validação ou regra de negócio (ex: email duplicado)
        if (status === 400) {
          // Se vier no padrão { details: { field: message } }
          if (payload?.details && typeof payload.details === 'object') {
            Object.entries(payload.details).forEach(([field, message]) => {
              if (field in schema.shape) {
                setError(field as keyof FormData, { type: 'server', message: String(message) })
              }
            })
          }

          // Mensagem direta (ex.: "Email já cadastrado")
          if (payload?.message) {
            const msg = String(payload.message)
            // heurística: se a mensagem mencionar email, joga no campo
            if (/email/i.test(msg)) {
              setError('email', { type: 'server', message: msg })
            } else {
              setApiError(msg)
            }
            return
          }
        }

        // Outros erros conhecidos
        if (status === 409 && payload?.message) {
          // se você resolver retornar 409 para conflito, cai aqui
          setError('email', { type: 'server', message: String(payload.message) })
          return
        }

        // const payload = err.response?.data as Record<string, unknown>;
        const message =
        typeof payload?.message === 'string'
            ? payload.message
            : 'Erro ao salvar. Tente novamente.';
        setApiError(message);

        return
      }

      // fallback para erros não-axios
      setApiError('Erro inesperado. Tente novamente.')
    }
  }

  return (
    <div className="card">
      <h2>{id ? 'Editar Usuário' : 'Novo Usuário'}</h2>

      {/* Alerta geral */}
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
