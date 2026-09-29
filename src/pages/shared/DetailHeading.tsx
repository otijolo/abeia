import type { Status } from '../../data/types'
import { StatusBadge } from '../../components/ui/StatusBadge'
import styles from './DetailHeading.module.css'

interface Props {
  title: string
  status: Status
  /** Data exibida abaixo do título */
  date?: string
  /** Badge abaixo do título em vez de alinhado à direita */
  badgeBelow?: boolean
}

/** Título grande das telas de detalhe com badge de status */
export function DetailHeading({ title, status, date, badgeBelow }: Props) {
  return (
    <div className={`${styles.heading} ${badgeBelow ? styles.stacked : ''}`}>
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        {date && <p className={styles.date}>{date}</p>}
      </div>
      <StatusBadge status={status} />
    </div>
  )
}
