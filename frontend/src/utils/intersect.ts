import { User } from '../types'

export function intersectById(a: User[], b: User[]): User[] {
  const set = new Set(b.map(x => x.id))
  return a.filter(x => set.has(x.id))
}

// NOVO: interseção de N listas (2, 3, ...)
export function intersectManyById(lists: User[][]): User[] {
  if (lists.length === 0) return []
  if (lists.length === 1) return lists[0]
  return lists.reduce((acc, cur) => intersectById(acc, cur))
}
