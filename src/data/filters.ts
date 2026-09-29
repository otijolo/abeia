import type { Status } from './types'

export type StatusFilter = 'todos' | Status

export const statusFilterOptions: { value: StatusFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'normal', label: 'Normal' },
  { value: 'atencao', label: 'Atenção' },
  { value: 'critico', label: 'Crítico' },
]
