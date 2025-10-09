// src/api/userApi.ts
import { api } from './client'
import { StatsResponse, User } from '../types'

// LISTAGEM
export const listAll = async () => {
  const r = await api.get<User[]>('/users')
  return r.data
}

// FILTROS
export const getByName = async (name: string) => {
  const r = await api.get<User[]>('/users/by-name', { params: { name } })
  return r.data
}
export const getByEmail = async (email: string) => {
  const r = await api.get<User[]>('/users/by-email', { params: { email } })
  return r.data
}
export const getByRole = async (role: string) => {
  const r = await api.get<User[]>('/users/by-role', { params: { role } })
  return r.data
}
export const getByActive = async (active: boolean) => {
  const r = await api.get<User[]>('/users/by-active', { params: { active } })
  return r.data
}

// CRUD
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

// (opcional) caso use PATCH em algum lugar
export const patchUser = async (id: string | number, updates: Partial<User>) => {
  const r = await api.patch<User>(`/users/${id}`, updates)
  return r.data
}
