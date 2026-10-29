import type { ReactNode } from 'react'
import { Card } from './Card'
import styles from './StatCard.module.css'

interface Props {
  icon: ReactNode
  label: string
  value: string | number
  to: string
  indicator?: ReactNode
}

export function StatCard({ icon, label, value, to, indicator }: Props) {
  return (
    <Card to={to} className={styles.card}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        {icon}
      </div>
      <strong className={styles.value}>{value}{indicator}</strong>
    </Card>
  )
}
