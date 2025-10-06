export type User = {
  id?: number
  name: string
  email: string
  role: string
  active: boolean
}

export type StatsResponse = {
  byRole: Record<string, number>
  byActive: { active?: number; inactive?: number } | Record<string, number>
}
