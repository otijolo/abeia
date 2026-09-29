import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './SectionTitle.module.css'

interface Props {
  children: ReactNode
  action?: { label: string; to: string }
}

export function SectionTitle({ children, action }: Props) {
  return (
    <div className={styles.row}>
      <h2 className={styles.title}>{children}</h2>
      {action && (
        <Link to={action.to} className={styles.action}>
          {action.label}
        </Link>
      )}
    </div>
  )
}
