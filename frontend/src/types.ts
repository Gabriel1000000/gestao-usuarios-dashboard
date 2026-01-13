export type SystemRole = 'ADMIN' | 'MANAGER' | 'USER'

export type User = {
  id: number
  name: string
  email: string
  jobTitle: string
  systemRole: SystemRole
  active: boolean
}


export type StatsResponse = {
  byActive: Record<'active' | 'inactive', number>
  byRole?: Record<string, number>        // compat (se existir)
  byJobTitle?: Record<string, number>    // novo
  bySystemRole?: Record<SystemRole, number> // novo
}

export type UserFilters = {
  name?: string
  email?: string
  jobTitle?: string
  systemRole?: SystemRole
  active?: boolean
}
