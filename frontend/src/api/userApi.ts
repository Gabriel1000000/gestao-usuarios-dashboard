// src/api/userApi.ts
import { api } from './client'
import { StatsResponse, User, UserFilters } from '../types'

// BUSCA COM FILTROS COMBINADOS (endpoint novo)
export const searchUsers = async (filters: UserFilters) => {
  // normaliza para não mandar string vazia
  const params: Record<string, any> = {}

  if (filters.name?.trim()) params.name = filters.name.trim()
  if (filters.email?.trim()) params.email = filters.email.trim()
  if (filters.jobTitle?.trim()) params.jobTitle = filters.jobTitle.trim()
  if (filters.systemRole) params.systemRole = filters.systemRole
  if (filters.active !== undefined) params.active = filters.active

  const r = await api.get<User[]>('/users', { params })
  return r.data
}

// LISTAGEM
export const listAll = async () => searchUsers({})

// (opcional) manter antigos como "alias" temporário:
// export const getByName = async (name: string) => searchUsers({ name })
// export const getByEmail = async (email: string) => searchUsers({ email })
// export const getByActive = async (active: boolean) => searchUsers({ active })

export const removeUser = async (id: number) => {
  await api.delete(`/users/${id}`)
}

export const getStats = async (): Promise<StatsResponse> => {
  const r = await api.get<StatsResponse>('/users/stats')
  return r.data
}

export const getUser = async (id: string | number) => {
  const r = await api.get<User>(`/users/${id}`)
  return r.data
}

export const createUser = async (data: Omit<User, 'id'>) => {
  const r = await api.post<User>('/users', data)
  return r.data
}

export const updateUser = async (id: string | number, data: Partial<User>) => {
  const r = await api.put<User>(`/users/${id}`, data)
  return r.data
}

export const patchUser = async (id: string | number, updates: Partial<User>) => {
  const r = await api.patch<User>(`/users/${id}`, updates)
  return r.data
}

