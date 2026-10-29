import type { Status } from '../../data/types'
import styles from './StatusBadge.module.css'

export const statusLabel: Record<Status, string> = {
  normal: 'Normal',
  atencao: 'Atenção',
  critico: 'Crítico',
}

interface Props {
  status: Status
  /** Texto customizado (ex.: "Saudável") — por padrão usa o nome do status */
  label?: string
  /** Ocupa toda a largura (usado na última inspeção) */
  block?: boolean
  /** Status em texto, usado nos cards de listagem */
  plain?: boolean
  className?: string
}

export function StatusBadge({ status, label, block, plain, className }: Props) {
  const cls = [styles.badge, styles[status], block && styles.block, plain && styles.plain, className].filter(Boolean).join(' ')
  return <span className={cls}>{label ?? statusLabel[status]}</span>
}
