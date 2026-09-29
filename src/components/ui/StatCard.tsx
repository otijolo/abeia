import type { ReactNode } from 'react'
import { Card } from './Card'
import { IconBubble } from './IconBubble'
import styles from './StatCard.module.css'

interface Props {
  icon: ReactNode
  label: string
  value: string | number
  to: string
}

export function StatCard({ icon, label, value, to }: Props) {
  return (
    <Card to={to} className={styles.card}>
      <div className={styles.head}>
        <IconBubble>{icon}</IconBubble>
        <span className={styles.label}>{label}</span>
      </div>
      <strong className={styles.value}>{value}</strong>
    </Card>
  )
}
