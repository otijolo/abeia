import type { ReactNode } from 'react'
import type { Status } from '../../data/types'
import { ChevronRightIcon } from '../icons'
import { Card } from './Card'
import { StatusIcon } from './IconBubble'
import { StatusBadge } from './StatusBadge'
import styles from './ListCard.module.css'

interface Props {
  title: string
  subtitle: string
  status: Status
  to: string
  /** Ícone à esquerda; por padrão usa o ícone do status */
  icon?: ReactNode
}

/** Item de lista: ícone + título/subtítulo + badge de status + chevron */
export function ListCard({ title, subtitle, status, to, icon }: Props) {
  return (
    <Card to={to} className={styles.item}>
      {icon ?? <StatusIcon status={status} />}
      <div className={styles.text}>
        <strong className={styles.title}>{title}</strong>
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
      <StatusBadge status={status} plain className={styles.status} />
      <ChevronRightIcon size={20} className={styles.chevron} />
    </Card>
  )
}

export function ListStack({ children, gap = 10 }: { children: ReactNode; gap?: number }) {
  return (
    <div className={styles.stack} style={{ gap }}>
      {children}
    </div>
  )
}
