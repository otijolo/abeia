import type { ReactNode } from 'react'
import type { Status } from '../../data/types'
import { DesignIcon } from './DesignIcon'
import styles from './IconBubble.module.css'

type Tone = 'honey' | 'silver' | 'bronze' | 'danger'

interface Props {
  children: ReactNode
  tone?: Tone
  size?: number
}

/** Círculo amarelo claro com ícone — usado em cards e listas */
export function IconBubble({ children, tone = 'honey', size = 28 }: Props) {
  return (
    <span className={`${styles.bubble} ${styles[tone]}`} style={{ width: size, height: size }}>
      {children}
    </span>
  )
}

export function StatusIcon({ status }: { status: Status }) {
  return <DesignIcon name={`status-${status}`} />
}
